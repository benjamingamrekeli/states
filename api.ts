import State from "./types";

export const getStates = async () => {
    const response = await fetch("https://sampleapis.assimilate.be/thestates/states");
    return await response.json();
  };
  
  export const addState = async (newState: State) => {
    const response = await fetch("https://sampleapis.assimilate.be/thestates/states", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(newState),
    });
  
    if (!response.ok) {
      throw new Error("Failed to add state");
    }
  
    return await response.json();
  };

  export const updateState = async (id: number, updatedState: State) => {
    const response = await fetch(`https://sampleapis.assimilate.be/thestates/states/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(updatedState),
    });
  
    if (!response.ok) {
      throw new Error("Failed to update state");
    }
  
    return await response.json();
  };