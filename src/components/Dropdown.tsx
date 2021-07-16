import { FC, useState } from 'react';
import styled, { css } from 'styled-components';
import { Node } from '../App';

const exampleNodes = {
  "How might we help employees stay productive and healthy when working from home?": [{ name: "Remote workers can receive free coaching in self-discipline." }, { name: "Remote workers are forbidden from checking their email during the weekend." }, { name: "All remote workers must visit the office at least once a year to meet with their peers and managers." }, { name: "Work in a dedicated space that is free of distractions." }, { name: "Cable TV is a productivity killer! If you must watch TV while working, whatch shows on Netflix or Hulu with commercials removed." }, { name: "If you live with someone who keeps interrupting, establish clear break times when they can come in and interrupt you (e.g., 8–9 AM)." }],
  "How can we enable restaurant chefs to prepare dishes more efficiently and process orders faster at peak times?": [{name: "We need to make the kitchen as smart as possible, and enable the chef to monitor everything in his kitchen from a tablet on a live map."}, {name: "Have a team create an entirely new menu with fewer ingredients and less ambiguity in the naming system."}, {name: "Create an intelligent ordering system that keeps track of how long it takes for each dish to cook and optimizes cooking times based on past data."}, {name: "Teach customers about the cooking times of each dish so that they can make better ordering decisions."}, {name: "Track how long it takes each chef to prepare each dish, and assign dishes accordingly"}],
  "How can we help blind people find their way more independently in unfamiliar environments?": [{name: "The phone performs a scan of an environment using its camera. It uses machine vision to build a map of the environment, and can then determine the location of the user within that environment"}, {name: "The app could also use other sensors on the phone, such as a compass and GPS, to provide more information about the environment"}, {name: "The phone should warn the user in situations that are potentially dangerous, such as an upcoming flight of stairs, or a car coming up fast behind them."}, {name: "Build a navigation system based on sound, which can be used along with a cane to give audio feedback about the distance and direction to nearby obstacles."}, {name: "We will use information from social networks to tell the user about events that are happening in the area they are in, so they get a sense of what's going on around them."}],
  "How can we help long-haul passengers to adapt their biorhythms to the time zones of their destination as quickly as possible?": [{name: "From a selection of hypnosis CDs, passengers can choose those that will put them into a deeper sleep than usual. This will help them to sleep better when the plane reaches its destination."}, {name: "Long-haul passengers are served meals by the cabin crew. The meals are designed to be in harmony with the destination time zone."}, {name: "Implement a light-based system that adjusts the body’s rhythm to new time zones. This system would be based on the core circadian rhythm which cycles between alertness and sleepiness."},{name: "Eat meals at regular times each day so you can achieve a routine bowel movement schedule. Try not to have meals too close to bedtime when you are adjusting to the new time zone, especially if you are traveling from east to west; otherwise you may become constipated."}, {name: "A smartphone app that uses a smartphone’s built-in sensors to calculate the user’s biorhythms and alerts them to the optimum times for sleeping, eating, and working."}, {name: "The temperature would be raised and lowered in time with the destination time zone."}, {name: "Sleep masks would filter out excess light and stimulate melatonin production in response to darkness."}],
  "How can we teach people to change their own habits more effortlessly?": [{name: "The software should have an automated \"nudge\" system that gently reminds users when they are falling behind, urges them to move forward with their goals and congratulates them when they achieve success."}, {name: "We should design the software to work with the user's natural cognitive cycle and develop a habit of using it that way every time."}, {name: "Set a specific time of day to take action. For example, „Every day after dinner I will go for a walk.\""}, {name: "Make sure to reward yourself along the way (\"When I jog three times this week I will buy myself something nice\")."}, {name: "Use tricks such as instant rewards („If I finish my workout at 9am then I can watch an episode of The West Wing while stretching”)."}, {name: "Get support from family and friends who are not counting on you for anything and who can be honest with you about your progress or lack thereof "}],
};

const Dropdown: FC<{
  setNodes: (input: Node[], problem: string) => void,
}> = props => {

  const [dropdownOpen, setDropdownOpen] = useState(false);

  return <Style>
    <Icon onClick={() => setDropdownOpen(b => !b)} dropdownOpen={dropdownOpen} className="px-4 py-1 flex align-center bg-white focus:outline-none">
      Example brAInstorms
      <svg className="h-5 w-5 text-gray-800" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill={ dropdownOpen ?"#FFD600" : "#434343"}>
        <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
      </svg>
    </Icon>

    {dropdownOpen && <div>
      {Object.entries(exampleNodes).map(([question, nodes]) =>
        <DropdownButton key={question} onClick={() => props.setNodes(nodes, question)}>
          {question}
        </DropdownButton>)}
    </div>}
  </Style>;
}

const DropdownButton = styled.button`

  text-align: left;
  margin: 25px 5px;
  padding: 0px 10px;
  :hover {
    color: #FFD600;
  }  
`

const Icon = styled.button<{ dropdownOpen?: boolean }>`
  display: flex;
  align-items: center;
  font-weight: bold;
  ${p => p.dropdownOpen && css`
      font-weight: bold;
      color: #FFD600;
   `}
`

const Style = styled.div`
  text-align: center;
  width: 230px;
  position: absolute;
  top: 50px;
  right: 50px;
  color: #434343;
  padding: 11px 5px 10px 15px;
  font-family: -apple-system, BlinkMacSystemFont, sans;
  font-size: 12px;
  line-height: auto;
  background: #FFFFFF;
  box-shadow: 0px 8px 30px 4px #E5E5E5;
  border-radius: 20px;
  z-index: 1;
  
  svg {
    margin-left: 10px;
  }
`;

export default Dropdown;