import React from 'react';
import {
    Accordion,
    AccordionActions,
    AccordionDetails,
    AccordionSummary, Button,
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
import {Page} from "../api/models/site";
import PageEditor from "./PageEditor";
import FileCopyOutlinedIcon from "@material-ui/icons/FileCopyOutlined";
import {InstallationAction} from "../plugins/Plugins";

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

    constructor(props: PageAccordionProps) {
        super(props);

        this.state = {
            page: {...props.treeModel.page}
        }
    }

    componentDidMount(): void {
    }

    onPageModelChanged(page: Page) {
        this.setState({page: page}, () => {
            this.props.onPageModelChange(page);
        });
    }

    deletePage() {
        this.props.deletePage(this.state.page);
    }

    savePage() {
        this.props.savePage(this.state.page);
    }

    render() {
        const {classes} = this.props;
        return (<Accordion>
            <AccordionSummary
                expandIcon={<ExpandMoreIcon/>}>
                <Typography className={classes.heading}>name: {this.props.treeModel.page.name}</Typography>
                <Typography className={classes.secondaryHeading}>type: {this.props.treeModel.page.type}</Typography>
            </AccordionSummary>
            <Divider/>
            <AccordionActions>
                <IconButton
                    edge="start"
                    color="inherit"
                    aria-label="export"
                    onClick={() => {
                        const installationActions = this.exportLayout();
                        navigator.clipboard.writeText(JSON.stringify(installationActions))
                        const event = new CustomEvent('record', {detail: installationActions});
                        document.dispatchEvent(event);
                    }}
                >
                    <FileCopyOutlinedIcon/>
                </IconButton>
                <IconButton
                    disabled={false}
                    edge="start"
                    style={{left: 0}}
                    color="inherit"
                    aria-label="Delete Page"
                    onClick={() => this.deletePage()}>
                    <DeleteOutlinedIcon/>
                </IconButton>
                <IconButton
                    edge="start"
                    color="inherit"
                    aria-label="Save Page"
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
                    edge="start"
                    color="inherit"
                    aria-label="export"
                    onClick={() => {
                        const installationActions = this.exportLayout();
                        navigator.clipboard.writeText(JSON.stringify(installationActions))
                        const event = new CustomEvent('record', {detail: installationActions});
                        document.dispatchEvent(event);
                    }}
                >
                    <FileCopyOutlinedIcon/>
                </IconButton>
                <IconButton
                    disabled={false}
                    edge="start"
                    style={{left: 0}}
                    color="inherit"
                    aria-label="Delete Page"
                    onClick={() => this.deletePage()}>
                    <DeleteOutlinedIcon/>
                </IconButton>
                <IconButton
                    edge="start"
                    color="inherit"
                    aria-label="Save Page"
                    onClick={() => this.savePage()}
                >
                    <SaveOutlinedIcon/>
                </IconButton>
            </AccordionActions>

        </Accordion>)
    }

    private exportLayout() {
        const page = {...this.state.page}
        return [{
            type: 'site',
            path: `/channels/{channel_id}/layouts/${page.name}`,
            method: 'PUT',
            body: page,
            responseCode: 201,
            description: `create page: ${page.name}`
        } as InstallationAction]
    }

}

export default withStyles(styles)(PageAccordion);
