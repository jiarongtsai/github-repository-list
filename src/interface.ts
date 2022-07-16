export interface QueryParamsState {
    [key: string]: any;
    page: number;
    queryTerm: string;
    type: string;
    sort: string;
    direction: string;
}
  
export interface RepositoryProps {
  id: number;
  full_name: string;
  homepage?: string; //link
  name?: string; //use this as repository name
  description?: string;
  language?: string; //display as tag
  stargazers_count?: number;
}
