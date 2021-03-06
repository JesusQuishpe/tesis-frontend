import React, { useRef, useState } from 'react'
import {  Button, Col, Form, FormControl, InputGroup, Row } from 'react-bootstrap'
import { AgGridReact } from 'ag-grid-react';
import 'ag-grid-community/dist/styles/ag-grid.css';
import 'ag-grid-community/dist/styles/ag-theme-alpine.css';
import CapturaService from 'services/CapturaService';
import { formatNumber } from 'utils/utilidades';
import { AiFillEdit } from 'react-icons/ai'
import { useNavigate } from 'react-router-dom';
import PDFIcon from 'assets/svg/pdf.svg'
import { END_POINT } from 'utils/conf';

//Parametros para poder filtrar por fecha en el ag-grid
var filterParams = {
  comparator: function (filterLocalDateAtMidnight, cellValue) {
    var dateAsString = cellValue;
    if (dateAsString == null) return -1;
    var dateParts = dateAsString.split('-');
    var cellDate = new Date(
      Number(dateParts[0]),
      Number(dateParts[1]) - 1,
      Number(dateParts[2])
    );
    if (filterLocalDateAtMidnight.getTime() === cellDate.getTime()) {
      return 0;
    }
    if (cellDate < filterLocalDateAtMidnight) {
      return -1;
    }
    if (cellDate > filterLocalDateAtMidnight) {
      return 1;
    }
  },
  browserDatePicker: true,
}

const Acciones = (props) => {
  const navigate = useNavigate()
  /**
   * Navega a un formulario para editar los resultados de la prueba
   * @param {number} idCaptura 
   */
  const handleClick = (idCaptura) => {
    navigate(`${idCaptura}`)
  }

  return (
    <div className='d-flex justify-content-around'>
      <Button onClick={() => handleClick(props.data.result_id)}><AiFillEdit /></Button>
      <a
        className='btn btn-danger'
        href={END_POINT + `resultado/${props.data.order_id}/pdf`}
        target='_blank'
      ><img src={PDFIcon} width="20px" height={"20px"} /></a>
    </div>
  )
}

export const ConsultarResultados = () => {
  //Refs
  const queryRef = useRef()
  const resultadosRef = useRef(null)
  //States
  const [resultados, setResultados] = useState([])
  const [resultadosColumnDefs] = useState([
    {
      headerName: "N?? orden",
      field: "order_id",
      maxWidth: 200,
      sortable: true,
      filter: true,
      floatingFilter: true,
      suppressMenu: true
    },
    {
      headerName: "Fecha",
      field: "date",
      flex: 1,
      sortable: true,
      filter: 'agDateColumnFilter',
      filterParams: filterParams,
      floatingFilter: true,
      suppressMenu: true
    },
    { headerName: "Hora", field: "hour", sortable: true },
    { headerName: "N?? pruebas", field: "test_items", sortable: true },
    {
      headerName: "Total",
      field: "total",
      maxWidth: 100,
      valueFormatter: (params) => {
        return formatNumber(params.value)
      }
    },
    {
      headerName: "Acciones",
      maxWidth: 150,
      cellRenderer: Acciones,
    }
  ])

  /**
   * Carga los resultados del paciente por numero de cedula
   * @param {string} cedula n??mero de cedula del paciente
   */
  const cargarResultados = async (cedula) => {
    try {
      resultadosRef.current.api.showLoadingOverlay()
      let resultados = await CapturaService.getResultadosPorCedula(cedula)
      if(resultados.length===0){
        resultadosRef.current.api.showNoRowsOverlay()
      }else{
        resultadosRef.current.api.hideOverlay()
      }
      setResultados(resultados)
    } catch (error) {
      resultadosRef.current.api.showNoRowsOverlay()
      console.log(error);
    }
  }

  /**
   * Handler para buscar resultados por numero de cedula del paciente
   * @param {Event} e 
   */
  const handleSubmitSearch = async (e) => {
    e.preventDefault()
    let query = queryRef.current.value
    cargarResultados(query)
  }

  return (
    <div className='p-4'>
      <h4 className='mb-3'>Consulta de resultados</h4>
      <Row>
        <Col>
          <Form onSubmit={handleSubmitSearch}>
            <InputGroup className="mb-3">
              <FormControl
                placeholder="Buscar por el n??mero de c??dula"
                aria-label="Input para el n??mero de cedula del paciente"
                className='me-2'
                type='text'
                ref={queryRef}
              />
              <Button variant="secondary" type='submit' className="me-2">
                Buscar
              </Button>
            </InputGroup>
          </Form>
        </Col>
      </Row>
      
      <div className="ag-theme-alpine" style={{ height: 500, width: "100%" }}>

        <AgGridReact
          ref={resultadosRef}
          rowData={resultados}
          columnDefs={resultadosColumnDefs}
          rowSelection={'single'}
          pagination
          overlayLoadingTemplate={
            '<span class="ag-overlay-loading-center">Cargando...</span>'
          }
          overlayNoRowsTemplate={
            '<span class="text-center">No hay resultados que mostrar</span>'
          }
        >
        </AgGridReact>
      </div>
    </div>
  )
}
