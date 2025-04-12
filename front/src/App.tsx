import { Button, Input, notification, Select, Switch } from "antd";
import { useEffect, useState } from "react";
import templateService from "./services/template.service";

function App() {
  const[templateList, setTemplateList] = useState<string[]>([])
  const [selectedTemplate, setSelectedTemplate] = useState<string | undefined>(undefined)
  const [fieldsValue, setFieldsValue] = useState<{fieldName: string, replacer:string}[]>([])
  const [api, contextHolder] = notification.useNotification();
  const [isCommonFieldsMode, setIsCommonFieldsMode] = useState<boolean>(false)
  const [allTemplatesData, setAllTemplatesData] = useState<{
    templateName: string,
    data: {fieldName: string, replacer:string}[]
  }[]>([])

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
    
    // Load all templates data
    const storedData = localStorage.getItem('templateStoredData')
    if (storedData) {
      const parsedData = JSON.parse(storedData)
      setAllTemplatesData(parsedData)
    }
  }, [])
  
  const changeTemplate = (value: string) => {
    const storedData = localStorage.getItem('templateStoredData')
    const storedDataObject:{
      templateName: string,
      data: {fieldName: string, replacer:string}[]
    }[] = storedData ? JSON.parse(storedData) : []
    
    const foundStoredTemplate = storedDataObject.find((el: {
      templateName: string,
      data: {fieldName: string, replacer:string}[]
    }) => el.templateName === value)
    if(foundStoredTemplate){
      setFieldsValue(foundStoredTemplate.data)
    }else{
      setFieldsValue([])
    }
    setSelectedTemplate(value)
    
    // If in common fields mode, show all fields from all templates
    if (isCommonFieldsMode) {
      loadCommonFields()
    }
  }
  
  const loadCommonFields = () => {
    const storedData = localStorage.getItem('templateStoredData')
    if (!storedData) return
    
    const storedDataObject = JSON.parse(storedData)
    // Combine all fields from all templates into one array
    const allFields: {fieldName: string, replacer:string}[] = []
    
    storedDataObject.forEach((template: {
      templateName: string,
      data: {fieldName: string, replacer:string}[]
    }) => {
      template.data.forEach((field: {fieldName: string, replacer:string}) => {
        // Only add if fieldName is not already in allFields
        if (!allFields.some(f => f.fieldName === field.fieldName)) {
          allFields.push({...field})
        }
      })
    })
    
    setFieldsValue(allFields)
    setAllTemplatesData(storedDataObject)
  }
  
  const toggleCommonFieldsMode = (checked: boolean) => {
    setIsCommonFieldsMode(checked)
    
    if (checked) {
      // Load fields from all templates
      loadCommonFields()
    } else if (selectedTemplate) {
      // Go back to template-specific mode
      const storedData = localStorage.getItem('templateStoredData')
      if (!storedData) return
      
      const storedDataObject = JSON.parse(storedData)
      const foundStoredTemplate = storedDataObject.find((el: {
        templateName: string,
        data: {fieldName: string, replacer:string}[]
      }) => el.templateName === selectedTemplate)
      
      if(foundStoredTemplate){
        setFieldsValue(foundStoredTemplate.data)
      }else{
        setFieldsValue([])
      }
    }
  }
  
  const createTemplate = () => {

    if(!selectedTemplate || fieldsValue.length === 0){
      return 
    }
    if(!isCommonFieldsMode){
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
    }
    templateService.createTemplate(selectedTemplate, fieldsValue).then(res => {
      openNotification(res.status === 201 )
    })

  }

  return (
    <div className='w-screen h-screen flex flex-col gap-5 justify-center items-center'>
      {contextHolder}
      <h1>Создай свой документ</h1>
      <div className="flex items-center gap-4 mb-2">
        <span>Общие поля:</span>
        <Switch 
          checked={isCommonFieldsMode} 
          onChange={toggleCommonFieldsMode}
        />
      </div>
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
            disabled={isCommonFieldsMode}
            onClick={_ => {
              setFieldsValue([...fieldsValue, {fieldName: '', replacer: ''}])
            }}
          >
            Добавить шаблонное поле
          </Button>
        </div>
        {
          fieldsValue.map((el, index)=> 
            <div key={`${el.fieldName}-${index}`} className="flex gap-10 mt-5">
              <Input
                placeholder="Тест шаблону"
                value={el.fieldName}
                disabled={isCommonFieldsMode}
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
              <Button 
                onClick={() => {
                  fieldsValue.splice(index, 1)
                  setFieldsValue([...fieldsValue])
                }}
                disabled={isCommonFieldsMode}
              >-</Button>
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
