import React from 'react';
import 'react-sortable-tree/style.css';
import {JSONSchema7} from "json-schema";
import Form from "@rjsf/material-ui";
import {componentParameterDefinitionSchema} from "./catalog-utils";
import {exampleComponentDefintionParameters} from "../samples/Example";
import {Container} from "@material-ui/core";

type CatalogState = {}
type CatalogProps = {}

class CatalogTest extends React.Component<CatalogProps, CatalogState> {

  constructor (props: CatalogProps) {
    super(props);

  }

  render () {
    return <Container>
      <Form
        schema={componentParameterDefinitionSchema as JSONSchema7}
        formData={exampleComponentDefintionParameters}><></>
      </Form>
    </Container>
  }

}

export default CatalogTest;
