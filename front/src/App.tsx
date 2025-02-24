import { Button, Input, notification, Select } from "antd";
import { useEffect, useState } from "react";
import templateService from "./services/template.service";

function App() {
  const[templateList, setTemplateList] = useState<string[]>([])
  const [selectedTemplate, setSelectedTemplate] = useState<string | undefined>(undefined)
  const [fieldsValue, setFieldsValue] = useState<{fieldName: string, replacer:string}[]>([])
  const [api, contextHolder] = notification.useNotification();

  const openNotification = (isError: boolean = false) => {
    if(isError){
      api.success({
        message: 'Документ успешно создан',
      })
    }else{
      api.error({
        message:'Не удалось создать документ'
      })
    }
  }

  useEffect(() => {
    templateService.getTemplatesList().then(res => {
      setTemplateList(res)
    })
  }, [])
  
  const changeTemplate = (value: string) => {
    const storedData = localStorage.getItem('templateStoredData')
    const storedDataObject:{
      templateName: string,
      data: {fieldName: string, replacer:string}[]
    }[] = storedData ? JSON.parse(storedData) : []
    
    const foundStoredTemplate = storedDataObject.find(el => el.templateName === value)
    if(foundStoredTemplate){
      setFieldsValue(foundStoredTemplate.data)
    }else{
      setFieldsValue([])
    }
    setSelectedTemplate(value)
  }
  
  const createTemplate = () => {

    if(!selectedTemplate || fieldsValue.length === 0){
      return 
    }
    const storedData = localStorage.getItem('templateStoredData')
    const storedDataObject:{
      templateName: string,
      data: {fieldName: string, replacer:string}[]
    }[] = storedData ? JSON.parse(storedData) : []
    const foundStoredTemplate = storedDataObject.find(el => el.templateName === selectedTemplate)
    if(foundStoredTemplate){
      foundStoredTemplate.data = [...fieldsValue]
    }else{
      storedDataObject.push(
        {
          templateName: selectedTemplate,
          data: fieldsValue
        }
      )
    }

    localStorage.setItem('templateStoredData', JSON.stringify(storedDataObject))
    templateService.createTemplate(selectedTemplate, fieldsValue).then(res => {
      openNotification(res.status === 201 )
    })

  }

  return (
    <div className='w-screen h-screen flex flex-col gap-5 justify-center items-center'>
      {contextHolder}
      <h1>Создай свой документ</h1>
      <Select
        className="w-[400px]"
        placeholder='Выберите имя шаблона из доступных'
        value={selectedTemplate}
        options={templateList.map(el => ({label: el, value: el}))}
        onChange={changeTemplate}
      />
      <div className="w-[700px]">
        <div className="flex flex-row-reverse w-full">
          <Button 
            type="primary"
            onClick={_ => {
              setFieldsValue([...fieldsValue, {fieldName: '', replacer: ''}])
            }}
          >
            Добавить шаблонное поле
          </Button>
        </div>
        {
          fieldsValue.map((el, index)=> 
            <div key={el.fieldName} className="flex gap-10 mt-5">
              <Input
                placeholder="Тест шаблону"
                value={el.fieldName}
                onChange={value => {
                  const newFields = [...fieldsValue]
                  newFields[index].fieldName = value.target.value
                  setFieldsValue(newFields)
                }}
              ></Input>
              <Input
                placeholder="На что поменять"
                value={el.replacer}
                onChange={value => {
                  const newFields = [...fieldsValue]
                  newFields[index].replacer = value.target.value
                  setFieldsValue(newFields)
                }}
              ></Input>
              <Button onClick={() => {
                fieldsValue.splice(index, 1)
                setFieldsValue([...fieldsValue])
              }}>-</Button>
            </div>
          )
        }
        <div className="mt-5 flex justify-center">
          <Button type="primary" onClick={createTemplate}>
            Создать шаблон
          </Button>
        </div>
      </div>
    </div>    
  )
}

export default App;
