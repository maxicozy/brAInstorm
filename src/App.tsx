import axios from 'axios';
import { Fragment, useCallback, useState } from "react";
import Tree from "react-d3-tree";
import { RawNodeDatum, TreeNodeDatum } from "react-d3-tree/lib/types/common";
import styled from 'styled-components';
import { v4 as uuid } from "uuid";
import CustomNode from './components/CustomNode';
import Input from './components/Input';
import { Point, useCenteredTree } from "./helpers";
import spinnerSrc from "./spinner.svg";


const API_KEY = process.env.REACT_APP_OPENAI_API_KEY;
const URL = "https://api.openai.com/v1/engines/davinci/completions";
const headers = {
  "Content-Type": "application/json",
  Authorization: `Bearer ${API_KEY}`,
};

const solvePrompt = (question: string) => {
  return {
    prompt: `This is a brainstorm, which follows the 7 Rules of Brainstorming, including „Encourage wild Ideas“. The best way to solve a hard problem is to come up with as many viable solutions as possible. Here are a few examples of hard problems and possible steps that could be taken to solve them.\n\nProblem: How do I find love?\n1. Build confidence in yourself. You cannot find love if you do not first love yourself.\n2. Be active in the real world. Find hobbies, get involved in organizations, go to the gym, build friends, etc. Before you find a partner you must have friends.\n3. Practice communication skills. Learn how to talk about yourself and listen to others. This will help you build better relationships.\n4. Get outside your comfort zone. If you are not comfortable talking to strangers, start small. Talk to a cashier, or sit with a stranger at lunch.\n\nProblem: How can I get rich without getting lucky?\n1. Seek wealth, not money or status. Wealth is having assets that earn while you sleep. Money is how we transfer time and wealth. Status is your place in the social hierarchy.\n2. You will get rich by giving society what it wants but does not yet know how to get. At scale.\n3. Pick business partners with high intelligence, energy, and, above all, integrity.\n\nProblem: How can we motivate people to track their health in an app?\n1. Users get free screening services, such as a complete blood count\n2. Users who track their medication in our app are warned of known drug interactions.\n3. Personalized health reports based on the user’s data are offered\n4. Patients can choose to share their medical records with doctors, friends or family members.\n\nProblem: ${question}\n1.`,   
    temperature: 0.7,
    max_tokens: 500,
    top_p: 1,
    frequency_penalty: 0.5,
    presence_penalty: 0,
    stop: ["Problem:"],
  };
};

interface Node extends RawNodeDatum {
  question?: string
  id?: string,
  children?: Node[]
  isStart?: boolean
}

async function solveProblem(question: string, depth: number): Promise<Node[]> {
  if (depth === 0) return [];
  // returns an object for a question
  const data = solvePrompt(question.trim());
  try {
    const res = await axios.post(URL, data, { headers });
    const out: string = res.data.choices[0].text;
    const lines = out.split("\n").filter((line) => line.trim() !== "");
    //const statements = lines.map((line) => line.split(".")[2].trim());



    const nodes = await Promise.all(lines.map(async s => {
      // const question = await toQuestion(s);
      return {
        name: s,
        question: s,
        id: uuid(),
        children: await solveProblem(question, depth - 1),
      }
    }))

    console.log(nodes)
    return nodes;
  } catch (error) {
    console.error(error);
    return []
  }
}

function App() {
  const [isLoading, setIsLoading] = useState(false);
  const [problem, setProblem] = useState("");
  const [trees, setTrees] = useState<Node[]>();
  const [showSpinner, setShowSpinner] = useState(false);
  const [centeredTranslate, containerRef] = useCenteredTree();
  const [translate, setTranslate] = useState<Point>()
  const [zoom, setZoom] = useState(1)
  const [inputShown, showInput] = useState(true)

  const update = useCallback((e: { translate: Point, zoom: number }) => {
    setTranslate(e.translate)
    setZoom(e.zoom)
  }, [setTranslate, setZoom])

  async function onSubmit() {
    // ignoring empty textarea
    if (problem.trim() === "") return;
    setTrees(undefined);
    setIsLoading(true);
    const nodes = await solveProblem(problem, 1);

    const size = Math.max(1, Math.ceil(nodes.length / 4))
    const arrays = new Array(4).fill(null).map((_, i) =>
      nodes.slice(i * size, (i + 1) * size)
    )

    setTrees(arrays.map(children => ({
      children,
      name: problem.trim(),
      isStart: true,
    })));

    showInput(false)
    setIsLoading(false);
  }

  async function onNodeClick(i: number, node: TreeNodeDatum) {
    if (!trees) return;
    setShowSpinner(true);

    const newTree = await generateChildrenForId({ ...trees[i] }, (node as any).id);

    setTrees(t => t?.map((tree, i2) => {
      if (i === i2) return newTree
      return tree
    }));
    setShowSpinner(false);
  }

  const reset = useCallback(() => {
    setTranslate(undefined);
    showInput(true)
    setZoom(1)
  }, [setTranslate, showInput])

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
    <Container ref={containerRef as any} >
      {showSpinner && (
        <div className="absolute bg-black shadow w-48 flex items-center justify-center rounded px-4 py-2 flex text-white opacity-75 mt-4">
          <img src={spinnerSrc} className="w-5 h-5 mr-2" alt="" />{" "}
          generating...
        </div>
      )}

      {trees?.map((tree, i) =>
        <TreeContainer key={i}>
          <Tree
            orientation={i < 2 ? "horizontal" : 'vertical'}
            pathClassFunc={() => "nostrokes"}
            translate={translate ?? centeredTranslate}
            zoom={zoom}
            scaleExtent={{ max: 5, min: 0.01 }}
            onUpdate={update}
            depthFactor={i % 2 ? (i < 2 ? 700 : 350) : (i < 2 ? -700 : -350)}
            separation={{ siblings: 3, nonSiblings: 3 }}
            data={tree}
            renderCustomNodeElement={({ nodeDatum, toggleNode }) => {
              if (!nodeDatum.name) return <Fragment />;
              if ((nodeDatum as Node).isStart) {
                if (i !== 3) return <Fragment />;
                return <CustomNode {...nodeDatum} onClick={reset} text={nodeDatum.name} />;
              }
              return <CustomNode {...nodeDatum} onClick={() => onNodeClick(i, nodeDatum)} text={nodeDatum.name} />;
            }}
          />
        </TreeContainer>
      )
      }

      {inputShown && <Fixed>
        <Input onSubmit={onSubmit} isLoading={isLoading} problem={problem} setProblem={(input) => setProblem(input)} />
      </Fixed>}

    </Container>
  );
}

const Container = styled.div`
  display: grid;
  align-items: center;
  justify-content: center;
  height: 100vh;
  width: 100vw;
`

const Fixed = styled.div`
  position: fixed;
  height: 100vh;
  width: 100vw;
  display: grid;
  align-items: center;
  justify-content: center;
`

const TreeContainer = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
`

export default App;