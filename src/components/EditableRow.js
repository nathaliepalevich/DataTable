import { Form } from 'antd';
import './EditableRow.scss'
import { EditableContext } from './EditableCell';

const EditableRow = ({ index, ...props }) => {
    const [form] = Form.useForm();
    return (
      <Form form={form} component={false}>
        <EditableContext.Provider value={form}>
          <tr {...props} />
        </EditableContext.Provider>
      </Form>
    );
  };

  export default EditableRow