export type Item = {
  id: number;
  name: string;
  sprite: string;
  frame: number;
  quantity?: number;
};

export const Items = new Map<number, Item>([
  [
    0,
    {
      id: 0,
      name: "Apple",
      sprite: "items",
      frame: 0,
    },
  ],
  [
    1,
    {
      id: 1,
      name: "Lumber",
      sprite: "items",
      frame: 1,
    },
  ],
  [
    2,
    {
      id: 2,
      name: "Gold",
      sprite: "items",
      frame: 2,
    },
  ],
  [
    3,
    {
      id: 3,
      name: "Banana",
      sprite: "items",
      frame: 3,
    },
  ],
]);
