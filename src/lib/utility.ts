export const getRandomInt = (min, max) => {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min)) + min;
};

export const getRandomBetween = (min: number, max:number)=>{
  return (Math.random() * (max - min)) + min;
}

export const createRandom = (upTo) => () => getRandomCeil(upTo);

export const getRandomFloor = (upTo) => Math.floor(Math.random() * upTo);

export const getRandomCeil = (upTo) => Math.ceil(Math.random() * upTo);
export const getUID = () => `_${Math.random().toString(36).substr(2, 9)}`;
export enum Directions {
  up,
  down,
  left,
  right,
}

/** Allows consumer to await the execution of async code in a loop */
export const asyncForEach = (
  array: any[],
  callback: (
    promise: () => Promise<void>,
    index?: number,
    arr?: Promise<void>[]
  ) => Promise<void>
): Promise<void> => {
  return new Promise<void>(async (resolve) => {
    for (let i = 0; i < array.length; i++) {
      await callback(array[i], i, array);
    }
    resolve();
  });
};

export const wait = (timeToWait): Promise<void> =>
  new Promise<void>((resolve) => setTimeout(() => resolve(), timeToWait));
