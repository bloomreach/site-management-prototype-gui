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
import {TreeModel} from "./page-util";
import {Page} from "../api/models";
import PageEditor from "./PageEditor";

type PageAccordionState = {
  page: Page
}
type PageAccordionProps = {
  classes: any
  treeModel: TreeModel
  onPageModelChange: (page: Page) => void
  deletePage: (page: Page) => void
  savePage: (page: Page) => void
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

class PageAccordion extends React.Component<PageAccordionProps, PageAccordionState> {

  constructor (props: PageAccordionProps) {
    super(props);

    this.state = {
      page: {...props.treeModel.page}
    }
  }

  componentDidMount (): void {
  }

  onPageModelChanged (page: Page) {
    this.setState({page: page}, () => {
      this.props.onPageModelChange(page);
    });
  }

  deletePage () {
    this.props.deletePage(this.state.page);
  }

  savePage () {
    this.props.savePage(this.state.page);
  }

  render () {
    const {classes} = this.props;
    return (<Accordion >
      <AccordionSummary
        expandIcon={<ExpandMoreIcon/>}>
        <Typography className={classes.heading}>name: {this.props.treeModel.page.name}</Typography>
        <Typography className={classes.secondaryHeading}>type: {this.props.treeModel.page.type}</Typography>
      </AccordionSummary>
      <Divider/>
      <AccordionActions>
        <IconButton
          disabled={false}
          edge="start"
          style={{left: 0}}
          color="inherit"
          aria-label="Delete"
          onClick={() => this.deletePage()}>
          <DeleteOutlinedIcon/>
        </IconButton>
        <IconButton
          edge="start"
          color="inherit"
          aria-label="Save"
          onClick={() => this.savePage()}
        >
          <SaveOutlinedIcon/>
        </IconButton>
      </AccordionActions>
      <AccordionDetails>
        <PageEditor treeModel={this.props.treeModel} onPageModelChange={page => this.onPageModelChanged(page)}/>
      </AccordionDetails>
      <AccordionActions>
        <IconButton
          disabled={false}
          edge="start"
          style={{left: 0}}
          color="inherit"
          aria-label="Delete"
          onClick={() => this.deletePage()}>
          <DeleteOutlinedIcon/>
        </IconButton>
        <IconButton
          edge="start"
          color="inherit"
          aria-label="Save"
          onClick={() => this.savePage()}
        >
          <SaveOutlinedIcon/>
        </IconButton>
      </AccordionActions>

    </Accordion>)
  }

}

export default withStyles(styles)(PageAccordion);