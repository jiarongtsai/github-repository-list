interface optionsProps {
  term: string;
  list: { text: string; value: string }[];
}

export function generateValue(data: optionsProps[]) {
  return data.reduce((previous: any, current: optionsProps) => {
    console.log(previous);
    return {
      ...previous,
      [current.term]: current.list[0].value,
    };
  }, {});
}
