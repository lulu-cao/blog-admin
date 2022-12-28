// My custom components are designed here, loaded at ./components.js, and used at ./models/book.resource.js
import { Button, ValueGroup, DatePicker, RichTextEditor } from "@adminjs/design-system";

const response = (props) => {
  const book = props.record.params;

  return (
    <div>
      <ValueGroup label="Completion Date">
        <DatePicker value={"2022-12"} propertyType="datetime"></DatePicker>
      </ValueGroup>
      <ValueGroup label="Review">
        <RichTextEditor 
          quill={{
            theme: 'snow',
          }}
          value={book.title} 
          onChange={()=>{console.log("Success")}}
        ></RichTextEditor>
      </ValueGroup>
      <Button>Add</Button>
    </div>
  )
}

export default response;

