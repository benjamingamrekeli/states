import State from "./types";

const token:string = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6ImJlbmphbWluLmdhbXJla2VsaUBzdHVkZW50LmFwLmJlIiwiaWF0IjoxNzM0MjYxODIzfQ.47TxKdEfV-6d-DzG0n4ciX2vrEoomKB-IMtG2ZARy20";

export const getStates = async () => {

  const response = await fetch("https://sampleapis.assimilate.be/thestates/states", {
    headers: {
      "Authorization": `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    const errorText = await response.text();
    console.error(`Error fetching states: ${response.status} ${response.statusText} - ${errorText}`);
    throw new Error(`Failed to fetch states: ${errorText}`);
  }

  return await response.json();
};
  
  export const addState = async (newState: Omit<State, 'id'>) => {
    const response = await fetch("https://sampleapis.assimilate.be/thestates/states", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`,
      },
      body: JSON.stringify(newState),
    });
  
    if (!response.ok) {
      const errorText = await response.text();
      console.error(`Error adding state: ${response.status} ${response.statusText} - ${errorText}`);
      throw new Error(`Failed to add state: ${errorText}`);
    }
  
    return await response.json();
  };

  export const updateState = async (id: number, updatedState: State) => {
    const response = await fetch(`https://sampleapis.assimilate.be/thestates/states/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`
      },
      body: JSON.stringify(updatedState),
    });
  
    if (!response.ok) {
      throw new Error("Failed to update state");
    }
  
    return await response.json();
  };