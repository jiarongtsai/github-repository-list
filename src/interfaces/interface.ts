export interface QueryParamsState {
  [key: string]: any;
  page: number;
  type: string;
  sort: string;
  direction: string;
  currentResult: RepositoryProps[];
}
  
export interface RepositoryProps {
  id: number;
  html_url: string; 
  name: string; 
  language: string; 
  stargazers_count: number;
}
