export const flattenArrayToPairs = (arr) => {
  let flatterArray = [];

  arr.forEach((row, i) => {
    row.forEach((e, j) => {
      flatterArray.push(e);
    });
  });

  if (!Array.isArray(flatterArray[0])) {
    return arr;
  }

  return flattenArrayToPairs(flatterArray);
};

export const getRandomInt = (max) => {
  return Math.floor(Math.random() * Math.floor(max));
};

export const isMatch = (objOne, objTwo) => {
  if (objOne != null && objTwo != null) {
    return objOne.image === objTwo.image || (objOne.isJar && objTwo.isJar);
  }
  return false;
};

export const checkRowsForMatch = (tileData) => {
  let matches = [];

  let numOfCols = tileData.length;
  let numOfRows = tileData[0].length;

  for (let j = 0; j < numOfRows; j++) {
    let firstIndex = [0, j];
    let potentialMatch = [firstIndex];
    let currentImageObj = tileData[0][j].imgObj;

    for (let i = 0; i < numOfCols; i++) {
      let nextTileObj = i + 1 < numOfCols ? tileData[i + 1][j].imgObj : null;

      if (isMatch(currentImageObj, nextTileObj)) {
        potentialMatch.push([i + 1, j]);
      } else {
        if (potentialMatch.length >= 3) {
          matches.push(potentialMatch);
        }
        firstIndex = [i + 1, j];
        potentialMatch = [firstIndex];
        currentImageObj = i + 1 < numOfCols ? tileData[i + 1][j].imgObj : null;
      }
    }
  }
  return matches;
};

export const checkColsForMatch = (tileData) => {
  let matches = [];

  let numOfCols = tileData.length;
  let numOfRows = tileData[0].length;

  for (let i = 0; i < numOfCols; i++) {
    let firstIndex = [i, 0];
    let potentialMatch = [firstIndex];
    let currentImageObj = tileData[i][0].imgObj;

    for (let j = 0; j < numOfRows; j++) {
      let nextTileObj = j + 1 < numOfRows ? tileData[i][j + 1].imgObj : null;

      if (isMatch(currentImageObj, nextTileObj)) {
        potentialMatch.push([i, j + 1]);
      } else {
        if (potentialMatch.length >= 3) {
          matches.push(potentialMatch);
        }
        firstIndex = [i, j + 1];
        potentialMatch = [firstIndex];
        currentImageObj = j + 1 < numOfRows ? tileData[i][j + 1].imgObj : null;
      }
    }
  }
  return matches;
};

export const getAllMatches = (tileData) => {
  let rowMatches = checkRowsForMatch(tileData);
  let colMatches = checkColsForMatch(tileData);

  return [...rowMatches, ...colMatches];
};

export const markAsMatch = (matches, tileData) => {
  matches.forEach((match) => {
    match.forEach((e) => {
      let i = e[0];
      let j = e[1];
      console.log("i, j", i, j);
      tileData[i][j].markedAsMatch = true;
    });
  });
};
