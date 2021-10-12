import React from 'react';
import {
    Accordion,
    AccordionSummary,
    AppBar,
    Button,
    Container,
    Toolbar,
    Typography,
    withStyles
} from "@material-ui/core";
import AddOutlinedIcon from "@material-ui/icons/Add";
import Icon from "@material-ui/core/Icon";
import {getBaseUrl, getContentTypeOperationsApi} from "../ApiContext";
import {LogContext} from "../LogContext";
import {logError, logSuccess} from "../common/common-utils";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
import {ContentType} from "../api/models/contenttype";
import {ContentTypeOperationsApi} from "../api/apis/content-type-operations-api";

type ContentTypesState = {
    types: Array<ContentType>,
    noDevelopmentProject: boolean
    dialogOpen: boolean
}
type ContentTypesProps = {
    classes: any,
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

class ContentTypes extends React.Component<ContentTypesProps, ContentTypesState> {

    static contextType = LogContext;
    context!: React.ContextType<typeof LogContext>;

    constructor(props: ContentTypesProps) {
        super(props);

        this.state = {
            types: [],
            noDevelopmentProject: true,
            dialogOpen: false
        }
    }

    componentDidMount(): void {
        this.updateContentTypes();
    }

    updateContentTypes() {
        const api: ContentTypeOperationsApi = getContentTypeOperationsApi();
        api.getContentTypes('development').then(value => {
            const data: Array<ContentType> = value.data;
            this.setState({types: data, noDevelopmentProject: false});
            logSuccess('retrieved content types..', this.context);
        }).catch(reason => logError("error trying to get the content types, reason:", reason?.data));
    }

    render() {
        const {classes} = this.props;
        const {types, noDevelopmentProject} = this.state;
        return <>
            <AppBar position="sticky" variant={'outlined'} color={'default'}>
                <Toolbar>
                    <Button
                        variant="outlined"
                        disabled={noDevelopmentProject}
                        color="primary"
                        style={{marginRight: '10px'}}
                        startIcon={<AddOutlinedIcon/>}
                        onClick={() => window.open(`${getBaseUrl()}/cms/content/path/hippo:namespaces/brxsaas`, 'new')}
                    >
                        Add Content Type
                    </Button>
                    <Button
                        disabled={!noDevelopmentProject}
                        variant="outlined"
                        color="primary"
                        style={{marginRight: '10px'}}
                        startIcon={<Icon className="fas fa-code-branch"/>}
                        onClick={() => window.open(`${getBaseUrl()}/cms/projects`, 'new')}
                    >
                        Development project (with content type changes)
                    </Button>
                </Toolbar>
            </AppBar>
            {types.map((type, index) => {
                return (
                    <Accordion>
                        <AccordionSummary
                            expandIcon={<ExpandMoreIcon/>}>
                            <Typography className={classes.heading}>{type.name}</Typography>
                            <Typography className={classes.secondaryHeading}>{type.type}</Typography>
                        </AccordionSummary>
                        <Container>
                            <pre>{JSON.stringify(type, undefined, 2)}</pre>
                        </Container>


                        {/*<ChannelEditor channel={channel}/>*/}
                    </Accordion>
                )
            })}
        </>
    }

}

export default withStyles(styles)(ContentTypes);
