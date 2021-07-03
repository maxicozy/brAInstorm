import axios from "axios";
import { Fragment, useState } from "react";
import Tree from "react-d3-tree";
import { TreeNodeDatum } from "react-d3-tree/lib/types/common";
import { v4 as uuid } from "uuid";
import CustomNode from './components/CustomNode';
import Input from "./components/Input";
import { useCenteredTree } from "./helpers";
import spinnerSrc from "./spinner.svg";

const API_KEY = process.env.REACT_APP_OPENAI_API_KEY;
const URL = "https://api.openai.com/v1/engines/davinci/completions";
const headers = {
  "Content-Type": "application/json",
  Authorization: `Bearer ${API_KEY}`,
};
console.log(process.env);
const solvePrompt = (question: string) => {
  return {
    prompt: `The best way to solve a hard problem is to break it up into as many components as possible. Here are a few examples of hard problems and the list of steps needed to solve them.\n\nProblem: How do I find love?\n1. Build confidence in yourself. You cannot find love if you do not first love yourself.\n2. Be active in the real world. Find hobbies, get involved in organizations, go to the gym, build friends, etc. Before you find a partner you must have friends.\n3. Practice communication skills. Learn how to talk about yourself and listen to others. This will help you build better relationships.\n4. Get outside your comfort zone. If you are not comfortable talking to strangers, start small. Talk to a cashier, or sit with a stranger at lunch.\n\nProblem: How can I get rich without getting lucky?\n1. Seek wealth, not money or status. Wealth is having assets that earn while you sleep. Money is how we transfer time and wealth. Status is your place in the social hierarchy.\n2. Ignore people playing status games. They gain status by attacking people playing wealth creation games.\n3. You will get rich by giving society what it wants but does not yet know how to get. At scale.\n4. Pick business partners with high intelligence, energy, and, above all, integrity.\n\nProblem: How do I get a higher GPA?\n1. Find a mentor. A good mentor will help you figure out what you do and do not know and set goals for each semester.\n2. Make a list of your GPA goals for each semester. Have a goal for each class you take.\n3. Have a goal for each class of the GPA you want to have at the end of the semester.\n4. Make a list of everything you can do to get that grade.\n5. Make a schedule for completing each item on the list.\n6. Follow the schedule.\n7. Keep going. Do not stop until you get where you want to go.\n\nProblem: ${question}\n1.`,
    temperature: 0.7,
    max_tokens: 300,
    top_p: 1,
    frequency_penalty: 1,
    presence_penalty: 1,
    stop: ["Problem:"],
  };
};

interface Node {
  name: string,
  question?: string
  id?: string,
  children?: Node[]
}

async function solveProblem(question: string, depth: number): Promise<Node[]> {
  if (depth === 0) return [];
  // returns an object for a question
  const data = solvePrompt(question.trim());
  try {
    const res = await axios.post(URL, data, { headers });
    const out: string = res.data.choices[0].text;
    let lines = out.split("\n").filter((line) => line.trim() !== "");
    let statements = lines.map((line) => line.split(".")[1].trim());

    let nodes: Node[] = [];
    for (const s of statements) {
      // const question = await toQuestion(s);
      nodes.push({
        name: s,
        question: s,
        id: uuid(),
        children: await solveProblem(question, depth - 1),
      });
    }
    return nodes;
  } catch (error) {
    console.error(error);
    return []
  }
}



function App() {
  const [isLoading, setIsLoading] = useState(false);
  const [problem, setProblem] = useState("");
  const [tree, setTree] = useState<Node>();
  const [showSpinner, setShowSpinner] = useState(false);
  const [translate, containerRef] = useCenteredTree();

  async function onSubmit() {
    // ignoring empty textarea
    if (problem.trim() === "") return;

    setTree(undefined);
    setIsLoading(true);
    let children = await solveProblem(problem, 1);
    setTree({
      children: children,
      name: problem.trim(),
    });

    setIsLoading(false);
    console.log(tree);

    return;
  }

  async function onNodeClick(node: TreeNodeDatum) {
    console.log(node);
    if (!node || !tree) return;
    setShowSpinner(true);

    const newTree = await generateChildrenForId(tree, (node as any).id);
    setTree({
      ...newTree,
    });
    setShowSpinner(false);
  }

  async function generateChildrenForId(subtree: Node, id: string): Promise<Node> {
    if (!subtree.children) return subtree;

    subtree.children = await Promise.all(subtree.children.map(async child => {
      if (child.id === id && child.question) return {
        ...child,
        children: await solveProblem(child.question, 1),
      }
      return await generateChildrenForId(child, id);
    }));

    return subtree;
  }

  return (
    <>
      <div className=" h-full flex flex-col items-center justify-center">
        <div
          className="w-full h-full flex flex-col font-mono mt-4"
          style={{
            maxWidth: 900,
          }}
        >
        <Input onClick={() => onSubmit()} isLoading={isLoading} setProblem={() => setProblem(problem)} problem={problem}/>
        </div>
        <div
          ref={containerRef as any}
          className="bg-gray-50 w-full h-full items-center  shadow-2xl rounded border-4 mb-8 mt-12"
          style={{
            height: `90vh`,
            width: `90vw`,
          }}
        >
          {showSpinner && (
            <div className="w-full flex  justify-center">
              <div className="absolute bg-black shadow w-48 flex items-center justify-center rounded px-4 py-2 flex text-white opacity-75 mt-4">
                <img src={spinnerSrc} className="w-5 h-5 mr-2" alt="" />{" "}
                Calculating...
              </div>
            </div>
          )}
          <Tree
            translate={translate}
            depthFactor={500}
            separation={{ siblings: 3, nonSiblings: 3 }}
            data={tree ?? {} as any}
            renderCustomNodeElement={({ nodeDatum, toggleNode }) => {
              if (!nodeDatum.name) return <Fragment />;
              return (
                <CustomNode onClick={() => onNodeClick(nodeDatum)} name={nodeDatum.name} />
              );
            }}
          />
        </div>
      </div>
    </>
  );
}

export default App;
