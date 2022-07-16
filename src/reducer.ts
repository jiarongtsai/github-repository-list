import { QueryParamsState } from "./interface";

export enum QueryParamsActionKind {
    RESET_PAGE = "RESET_PAGE",
    LOAD_NEXT_PAGE = "LOAD_NEXT_PAGE",
    NO_MORE_PAGE = "NO_MORE_PAGE",
    CHANGE_PARAMS = "CHANGE_PARAMS",
}

type PayloadAction = {
    type: string;
    payload: {
      name: string;
      value: string;
    };
  };

type NoPayloadAction = { type: string };
  
type QueryParamsAction = PayloadAction | NoPayloadAction;
  

export  function queryParamsReducer(
    state: QueryParamsState,
    action: QueryParamsAction
  ) {
    switch (action.type) {
      case QueryParamsActionKind.CHANGE_PARAMS:
        const payloadAction = (action as PayloadAction).payload;
        return {
          ...state,
          page: 1,
          [payloadAction.name]: payloadAction.value,
        };
      case QueryParamsActionKind.RESET_PAGE:
        return {
          ...state,
          page: 1,
        };
      case QueryParamsActionKind.LOAD_NEXT_PAGE:
        return {
          ...state,
          page: state.page++,
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