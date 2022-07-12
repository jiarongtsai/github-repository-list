interface optionProps {
  term: string;
  list: { text: string; value: string }[];
}

export function generateValue(data: optionProps[]) {
  return data.reduce((previous: any, current: optionProps) => {
    return {
      ...previous,
      [current.term]: current.list[0].value,
    };
  }, {});
}
