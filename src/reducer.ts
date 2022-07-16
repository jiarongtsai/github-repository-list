import { QueryParamsState, RepositoryProps } from "./interface";

export enum QueryParamsActionKind {
    RESET_PAGE = "RESET_PAGE",
    LOAD_NEXT_PAGE = "LOAD_NEXT_PAGE",
    NO_MORE_PAGE = "NO_MORE_PAGE",
    CHANGE_PARAMS = "CHANGE_PARAMS",
}

type ChangeParamsAction = {
    type: string;
    payload: {
      name: string;
      value: string;
    };
};
  
type LoadDataAction = {
  type: string;
  payload: {
    nextPageData: RepositoryProps[]
  };
};

type NoPayloadAction = { type: string };
  
type QueryParamsAction = ChangeParamsAction | LoadDataAction | NoPayloadAction;
  

export  function queryParamsReducer(
    state: QueryParamsState,
    action: QueryParamsAction
  ) {
    switch (action.type) {
      case QueryParamsActionKind.CHANGE_PARAMS:
        const ChangeParamsAction = (action as ChangeParamsAction).payload;
        return {
          ...state,
          page: 1,
          currentResult: [],
          [ChangeParamsAction.name]: ChangeParamsAction.value,
        };
      case QueryParamsActionKind.RESET_PAGE:
        return {
          ...state,
          currentResult: [],
          page: 1,
        };
      case QueryParamsActionKind.LOAD_NEXT_PAGE:
        const LoadDataAction = (action as LoadDataAction).payload;
        return {
          ...state,
          page: state.page++,
          currentResult: [...state.currentResult, ...LoadDataAction.nextPageData]
        };
      case QueryParamsActionKind.NO_MORE_PAGE:
        return {
          ...state,
          page: 0,
        };
      default:
        return state;
    }
  }