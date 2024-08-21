import CancelOutlinedIcon from "@mui/icons-material/CancelOutlined";
import { Button, Modal, Paper } from "@mui/material";
import Typography from "@mui/material/Typography";
import Box from "@mui/system/Box";
import DataGrid, {
  Column,
  Editing,
  Item,
  Paging,
  Selection,
  Toolbar,
} from "devextreme-react/data-grid";
import "devextreme-react/text-area";
import { useState } from "react";
import { employees, states } from "./Data";
//Import Button as DevButton
import { Lookup } from "devextreme-react";

const steps = [
  "Select master blaster campaign settings",
  "Create an ad group",
  "Create an ad",
];

const notesEditorOptions = { height: 10 };

const App = () => {
  const [activeStep, setActiveStep] = useState(0);
  const [skipped, setSkipped] = useState(new Set<number>());
  const [viewPopup, setVIewPopup] = useState<boolean>(false);
  const handleOpen = () => setVIewPopup(true);
  const handleClose = () => setVIewPopup(false);
  const [stateData, setStateData] = useState<any>({});
  const isStepOptional = (step: number) => {
    return step === 1;
  };

  //Popup

  const isStepSkipped = (step: number) => {
    return skipped.has(step);
  };

  const handleNext = (e: any) => {
    e.preventDefault();
    let newSkipped = skipped;
    if (isStepSkipped(activeStep)) {
      newSkipped = new Set(newSkipped.values());
      newSkipped.delete(activeStep);
    }

    setActiveStep((prevActiveStep) => prevActiveStep + 1);
    setSkipped(newSkipped);
  };

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

  const handleSkip = (e: any) => {
    if (!isStepOptional(activeStep)) {
      // You probably want to guard against something like this,
      // it should never occur unless someone's actively trying to break something.
      throw new Error("You can't skip a step that isn't optional.");
    }

    setActiveStep((prevActiveStep) => prevActiveStep + 1);
    setSkipped((prevSkipped) => {
      const newSkipped = new Set(prevSkipped.values());
      newSkipped.add(activeStep);
      return newSkipped;
    });
  };

  const handleReset = () => {
    setActiveStep(0);
  };

  console.log("formData", stateData);

  return (
    <div id="data-grid-demo">
      <Box height={100} />
      <DataGrid
        dataSource={employees}
        keyExpr="ID"
        headerFilter={{ visible: true }}
        filterPanel={{ visible: true }}
        filterRow={{ visible: true }}
        allowColumnReordering={true}
        showBorders={true}
        onSelectionChanged={(e) => {
          console.log("dfdd", e.selectedRowsData[0].FirstName);
          // handleOpen();
        }}
        onEditingStart={(e) => console.log("first", e)}
        onSaving={(e) => {
          console.log("onSaving", e);
        }}
      >
        <Paging enabled={false} />
        <Toolbar>
          <Item location="before">
            <Button
              size="small"
              sx={{
                mr: 1,
              }}
              variant="outlined"
              onClick={() => {
                console.log(" Filter 1");
              }}
              endIcon={<CancelOutlinedIcon />}
            >
              Filter 1
            </Button>
            <Button
              sx={{
                mr: 1,
              }}
              size="small"
              variant="outlined"
              onClick={() => {
                console.log(" Filter 2");
              }}
              endIcon={<CancelOutlinedIcon />}
            >
              Filter 2
            </Button>

            <Button
              sx={{
                mr: 1,
              }}
              size="small"
              variant="outlined"
              onClick={() => {
                console.log("Filter 3");
              }}
              endIcon={<CancelOutlinedIcon />}
            >
              Filter 3
            </Button>

            <Button
              size="small"
              variant="outlined"
              onClick={() => {
                console.log("clear");
              }}
              endIcon={<CancelOutlinedIcon />}
            >
              Clear All
            </Button>
          </Item>
        </Toolbar>
        <Selection mode="single" />
        <Editing
          mode="popup"
          allowUpdating={true}
          allowAdding={true}
          allowDeleting={true}
        />

        <Column dataField="Prefix" caption="Title" width={70} />
        <Column dataField="FirstName" />
        <Column dataField="LastName" />
        <Column dataField="BirthDate" dataType="date" />
        <Column dataField="Position" width={170} />
        <Column dataField="HireDate" dataType="date" />
        <Column dataField="StateID" caption="State" width={125}>
          <Lookup dataSource={states} valueExpr="ID" displayExpr="Name" />
        </Column>
        <Column
          filterValue={["CMO"]}
          headerFilter={{
            searchMode: "contains",
            dataSource: [
              { text: "CMO", value: "CMO" },
              { text: "neil", value: "neil" },
            ],
          }}
          calculateDisplayValue={(rowData) => {
            if (!rowData.AssetClasses) return null;
            const assetClasses = rowData.AssetClasses.join(", ");
            return assetClasses;
          }}
          filterOperations={["contains"]}
          allowHeaderFiltering
          allowFiltering
          dataField="AssetClasses"
          visible={true}
          calculateFilterExpression={(v, o, t) => {
            return ["AssetClasses", "contains", `${v}`] as any;
          }}
          calculateCellValue={(rowData) => {
            if (!rowData.AssetClasses) return null;
            const assetClasses = rowData.AssetClasses;
            return assetClasses;
          }}
        />
        <Column dataField="Address" visible={false} />
        <Column dataField="Notes" visible={false} />
      </DataGrid>

      <div>
        <Modal
          open={viewPopup}
          onClose={handleClose}
          aria-labelledby="modal-modal-title"
          aria-describedby="modal-modal-description"
        >
          <Paper
            sx={{
              position: "absolute" as "absolute",
              top: "50%",
              left: "50%",
              transform: "translate(-50%, -50%)",
              width: 400,
              bgcolor: "background.paper",
              border: "2px solid #000",
              boxShadow: 24,
              p: 4,
            }}
          >
            <Typography id="modal-modal-title" variant="h6" component="h2">
              Text in a modal
            </Typography>
            <Typography id="modal-modal-description" sx={{ mt: 2 }}>
              Duis mollis, est non commodo luctus, nisi erat porttitor ligula.
            </Typography>
          </Paper>
        </Modal>
      </div>
    </div>
  );
};

export default App;
