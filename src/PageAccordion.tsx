import React from 'react';
import {
  Accordion,
  AccordionActions,
  AccordionDetails,
  AccordionSummary,
  Divider,
  IconButton,
  Typography,
  withStyles
} from "@material-ui/core";
import 'react-sortable-tree/style.css';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import DeleteOutlinedIcon from "@material-ui/icons/DeleteOutlined";
import SaveOutlinedIcon from "@material-ui/icons/SaveOutlined";
import {ExtendedNodeData, removeNode, TreeItem} from 'react-sortable-tree';
import {ComponentTreeItem, getNodeKey, TreeModel} from "./util";
import {Page} from "./api/models";
import PageEditor from "./PageEditor";

type PageState = {
  treeData: ComponentTreeItem[] | TreeItem[]
  saveDisabled: boolean
}
type PageProps = {
  classes: any
  treeModel: TreeModel
}

// @ts-ignore
const styles = theme => {
  return ({
    heading: {
      fontSize: theme.typography.pxToRem(15),
      flexBasis: '33.33%',
      flexShrink: 0,
    },
    secondaryHeading: {
      fontSize: theme.typography.pxToRem(15),
      color: theme.palette.text.secondary,
    },
  });
};

const componentSchema = {
  type: "object",
  properties: {
    name: {
      type: "string",
    },
    description: {
      type: "string"
    },
    parameters: {
      "type": "object",
      "additionalProperties": {
        "type": "string"
      }
    }
  }
};

class PageAccordion extends React.Component<PageProps, PageState> {

  constructor (props: PageProps) {
    super(props);

    this.state = {
      treeData: props.treeModel.treeData,
      saveDisabled: true,
    }
  }

  componentDidMount (): void {
  }

  onPageModelChanged (page: Page) {
    console.log('page model changed', page);
    console.log(JSON.stringify(page));
  }

  render () {
    const {classes} = this.props;
    return (
      <Accordion>
        <AccordionSummary
          expandIcon={<ExpandMoreIcon/>}>
          <Typography className={classes.heading}>name: {this.props.treeModel.page.name}</Typography>
          <Typography className={classes.secondaryHeading}>type: {this.props.treeModel.page.type}</Typography>
        </AccordionSummary>
        <Divider/>
        <AccordionDetails>
          <PageEditor treeModel={this.props.treeModel} onPageModelChange={page => this.onPageModelChanged(page)}/>
        </AccordionDetails>
        <Divider/>
        <AccordionActions>
          <IconButton
            disabled={false}
            edge="start"
            color="inherit"
            aria-label="Delete"
            onClick={(event) => console.log('deleting', this.props.treeModel.page.name)}
          >
            <DeleteOutlinedIcon/>
          </IconButton>
          <IconButton
            edge="start"
            color="inherit"
            aria-label="Save"
            // disabled={!item.changed}
            disabled={this.state.saveDisabled}
            onClick={(event) => this.setState({saveDisabled: true}, () => console.log('saving', this.props.treeModel.page.name))}
          >
            <SaveOutlinedIcon/>
          </IconButton>
        </AccordionActions>
      </Accordion>)
  }

  deleteComponent (rowInfo: ExtendedNodeData, callback?: () => void) {
    // @ts-ignore
    const treeData: TreeItem[] = removeNode({
      treeData: this.state.treeData,
      path: rowInfo.path,
      getNodeKey,
      ignoreCollapsed: true
    }).treeData;

    this.setState({treeData: treeData}, () => {
      if (callback) {
        callback();
      }
    });

  }
}

export default withStyles(styles)(PageAccordion);