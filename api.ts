export const getStates = async () => {
    const response = await fetch("https://sampleapis.assimilate.be/thestates/states");
    return await response.json();
  };
  