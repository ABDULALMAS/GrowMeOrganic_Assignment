 export interface Post {
    id: number;
    userId: number;
    title: string;
    body: string;
  }

   export interface Department {
    department: string;
    sub_departments: string[];
  }
  
  export interface SubDepartmentsState {
    [subDept: string]: boolean;
  }
  
  
  