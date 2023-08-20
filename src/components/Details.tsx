import React, { useEffect, useState } from "react";
import Typography from "@mui/material/Typography";
import { useNavigate } from "react-router-dom";
import { DataGrid, GridColDef, GridRowsProp } from "@mui/x-data-grid";
import axios from "axios";
import { Post, Department, SubDepartmentsState } from "./Interface";
import {
  List,
  ListItem,
  ListItemText,
  Collapse,
  Checkbox,
  Button,
} from "@mui/material";
import ExpandLess from "@mui/icons-material/ExpandLess";
import ExpandMore from "@mui/icons-material/ExpandMore";
import { Paper, Container } from "@material-ui/core";
import useStyles from "./styles";

const Details: React.FC = () => {
  const classes = useStyles();
  const navigate = useNavigate();

  // Check if user details exist in local storage
  useEffect(() => {
    const userDetails = localStorage.getItem("userDetails");
    if (!userDetails) {
      alert("Please enter your details before accessing this page.");
      navigate("/");
    }
  }, [navigate]);

  const [posts, setPosts] = useState<GridRowsProp>([]);
  const [expanded, setExpanded] = useState<Record<string, boolean>>({});
  const [deptState, setDeptState] = useState<
    Record<string, boolean | SubDepartmentsState>
  >({});

  // Fetch data from the API
  useEffect(() => {
    axios
      .get<Post[]>("https://jsonplaceholder.typicode.com/posts")
      .then((response) => {
        const formattedPosts = response.data.map((post) => ({
          id: post.id,
          userId: post.userId,
          title: post.title,
          body: post.body,
        }));
        setPosts(formattedPosts);
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
      });
  }, []);

  const cols: GridColDef[] = [
    { field: "id", headerName: "ID", width: 100 },
    { field: "userId", headerName: "User-ID", width: 100 },
    { field: "title", headerName: "Title", width: 400 },
    { field: "body", headerName: "Body", width: 600 },
  ];

  const handleExpand = (dept: string) => {
    setExpanded((prev) => ({
      ...prev,
      [dept]: !prev[dept],
    }));
  };

  const handleDeptCheckboxChange = (dept: string, checked: boolean) => {
    // Set the state for the main department checkbox
    setDeptState((prev) => ({
      ...prev,
      [dept]: checked,
    }));

    // If checked, set all sub-departments to true
    if (checked) {
      const subDepts = depts.find(
        (d) => d.department === dept
      )?.sub_departments;
      if (subDepts) {
        const subDeptState: SubDepartmentsState = subDepts.reduce(
          (acc, subDept) => ({ ...acc, [subDept]: true }),
          {}
        );
        setDeptState((prev) => ({
          ...prev,
          [dept]: subDeptState,
        }));
      }
    }
  };

  const handleSubDeptCheckboxChange = (
    dept: string,
    subDept: string,
    checked: boolean
  ) => {
    setDeptState((prev) => ({
      ...prev,
      [dept]: {
        ...(prev[dept] as SubDepartmentsState),
        [subDept]: checked,
      },
    }));
  };

  const isDeptChecked = (dept: string) => {
    const subDepts = depts.find((d) => d.department === dept)?.sub_departments;
    if (!subDepts) return false;

    const allSubDeptsChecked = subDepts.every(
      (subDept) => (deptState[dept] as SubDepartmentsState)?.[subDept] === true
    );
    const someSubDeptsChecked = subDepts.some(
      (subDept) => (deptState[dept] as SubDepartmentsState)?.[subDept] === true
    );

    return allSubDeptsChecked
      ? true
      : someSubDeptsChecked
      ? "indeterminate"
      : false;
  };

  const isSubDeptChecked = (dept: string, subDept: string) => {
    return (deptState[dept] as SubDepartmentsState)?.[subDept] || false;
  };

  const depts: Department[] = [
    {
      department: "customer_service",
      sub_departments: ["support", "customer_success"],
    },
    {
      department: "design",
      sub_departments: ["graphic_design", "product_design", "web_design"],
    },
  ];

  const goBack = (event: React.FormEvent) => {
    event.preventDefault();
    navigate("/");
  };

  return (
    <>
      <Paper className={classes.paper} elevation={3}>
        <Typography variant="h3" gutterBottom marginRight={2}>
          DETAILS
        </Typography>

        <div style={{ height: "500px", width: "100%" }}>
          <DataGrid rows={posts} columns={cols} />
        </div>
      </Paper>

      <Paper className={classes.paper} elevation={3}>
        <Typography variant="h3" gutterBottom>
          DEPARTMENT LIST
        </Typography>
        <List>
          {depts.map((dept) => {
            const deptChecked = isDeptChecked(dept.department);
            const isExpanded = expanded[dept.department];

            return (
              <>
                <Container component="main" maxWidth="xs">
                  <Paper className={classes.paper} elevation={3}>
                    <ListItem button>
                      <Checkbox
                        checked={deptChecked === true}
                        indeterminate={deptChecked === "indeterminate"}
                        onChange={(event) =>
                          handleDeptCheckboxChange(
                            dept.department,
                            event.target.checked
                          )
                        }
                      />
                      <ListItemText
                        onClick={() => handleExpand(dept.department)}
                        primary={`${dept.department} (${dept.sub_departments.length})`}
                      />
                      {isExpanded ? <ExpandLess /> : <ExpandMore />}
                    </ListItem>

                    <Collapse in={isExpanded} timeout="auto">
                      <List component="div" disablePadding>
                        {dept.sub_departments.map((subDept) => (
                          <ListItem key={subDept} button sx={{ marginLeft: 4 }}>
                            <Checkbox
                              checked={isSubDeptChecked(
                                dept.department,
                                subDept
                              )}
                              onChange={(event) =>
                                handleSubDeptCheckboxChange(
                                  dept.department,
                                  subDept,
                                  event.target.checked
                                )
                              }
                            />
                            <ListItemText primary={subDept} />
                          </ListItem>
                        ))}
                      </List>
                    </Collapse>
                  </Paper>
                </Container>
              </>
            );
          })}
        </List>
        <div className={classes.goBack}>
          <Button onClick={goBack} variant="contained" color="primary">
            Go Back
          </Button>
        </div>
      </Paper>
    </>
  );
};

export default Details;
