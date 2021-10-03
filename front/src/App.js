import React, { useState, useEffect } from "react";

function Module({ module, roadblocks, setRoadblocks })
{
  const onChange = event => {
    const tmp = [...roadblocks.roadblocks]

    for (const roadblock of tmp) {
      for (const updatedModule of roadblock.modules) {
        if (updatedModule.code === module.code) {
          if (updatedModule.code !== "B-INN-500") {
            updatedModule.isRegistered = !updatedModule.isRegistered;
            if (updatedModule.isRegistered) {
              roadblock.ongoingCredits += updatedModule.credits
            } else {
              roadblock.ongoingCredits -= updatedModule.credits
            }
          } else {
            roadblock.ongoingCredits -= updatedModule.credits
            updatedModule.credits = Number(event.target.value)
            roadblock.ongoingCredits += updatedModule.credits
          }
        }
      }
    }
    setRoadblocks({ ...roadblocks, roadblocks: tmp})
  }

  return (
    <li>
      {module.code !== "B-INN-500" ?
        <div>
          <input type="checkbox"
            id={module.title}
            defaultChecked={module.isRegistered}
            onChange={() => onChange()} />
          <label htmlFor={module.title}>
            {module.title} : { module.credits } credits
          </label>
        </div>
        :
        <div>
          <label htmlFor={module.title}> {module.title} : </label>
          <select onChange={event => onChange(event)}>
            <option value="1">1</option>
            <option value="3">3</option>
            <option value="5">5</option>
            <option value="8">8</option>
          </select>
          <label htmlFor={module.title}> credits </label>
        </div>
      }
    </li>
  )
}

function Roadblock({ roadblock, roadblocks, setRoadblocks })
{
  return (
    <li>
      <h3>{ roadblock.title } - { roadblock.creditsNeeded } credits needed
          { roadblock.creditsNeeded <= roadblock.ongoingCredits ? '✅' : '❌' }
      </h3>
      <h4>Ongoing : { roadblock.ongoingCredits } credits</h4>
      <ul>
        {roadblock.modules.map(module =>
          <Module
            key={module.code}
            module={module}
            roadblocks={roadblocks}
            setRoadblocks={setRoadblocks}
          />
        )}
      </ul>
    </li>
  )
}

function Simulator({ roadblocks, setRoadblocks })
{
  let ongoingCredits = 0
  for (const roadblock of roadblocks.roadblocks) {
    ongoingCredits += roadblock.ongoingCredits
  }

  return (
    <div>
      <h2>Total credits needed : { roadblocks.creditsNeeded } { roadblocks.creditsNeeded <= ongoingCredits ? '✅' : '❌' }</h2>
      <h2>Ongoing : { ongoingCredits } credits</h2>
      <ul>
        {roadblocks.roadblocks.map(roadblock =>
          <Roadblock
            key={roadblock.title}
            roadblock={roadblock}
            roadblocks={roadblocks}
            setRoadblocks={setRoadblocks}
          />
        )}
      </ul>
    </div>
  )
}


function App() {
  const [roadblocks, setRoadblocks] = useState({})

  useEffect(() => {
    async function fetchRoadblocks() {
      let response = await fetch('http://localhost:8000/')
      response = await response.json()
      setRoadblocks(response)
    }

    fetchRoadblocks()
  }, [])

  return (
    <div>
      <h1>Tek3 Roadblocks simulator</h1>
      {
        roadblocks.creditsNeeded ?
          <Simulator roadblocks={roadblocks} setRoadblocks={setRoadblocks}/>
          : <h2>Loading...</h2>
      }
    </div>
  );
}

export default App;
