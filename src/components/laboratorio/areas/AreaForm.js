import React, { useContext, useEffect, useState } from 'react';
import AreaService from 'services/AreaService';
import { Alert, Button, Col, Container, Form, Row } from 'react-bootstrap';
import { useParams } from 'react-router-dom';
import ToastContext from '../../../contexts/ToastContext';
import LoaderContext from 'contexts/LoaderContext';

export const AreaForm = () => {
  //Contexts
  const { openToast } = useContext(ToastContext)
  const { openLoader, closeLoader } = useContext(LoaderContext)
  //Other hooks
  const { idArea } = useParams();
  const isEdit = idArea ? true : false;
  //States
  const initialForm = {
    code: "",
    name: "",
    price: ""
  }
  const [showAlert, setShowAlert] = useState(false)
  const [form, setForm] = useState(initialForm);


  /**
   * Handler para actualizar los valores del formulario
   * @param {Event} e 
   */
  const handleForm = (e) => {
    const { name, value } = e.target;
    setForm({
      ...form,
      [name]: value.toUpperCase()
    });
  };

  /**
   * Handler para guardar los datos del area
   * @param {Event} e 
   * @returns 
   */
  const handleSubmit = async (e) => {
    try {
      e.preventDefault()
      if (form.code === "" || form.name === "" || form.price === "") {
        setShowAlert(true)
        setTimeout(() => {
          setShowAlert(false)
        }, 2000)
        return
      }
      openLoader(isEdit ? "Actualizando datos..." : "Creando area...")
      if (!isEdit) {
        await AreaService.crearArea(form)
        setForm(initialForm)
      } else {
        await AreaService.actualizarArea(form)
      }
      closeLoader()
      openToast(isEdit ? "Area actualizada" : "Area creada", true)
    } catch (error) {
      console.log(error);
      closeLoader()
      let message = error.response.data.message ? error.response.data.message :
        error.response.data.exception_message
      openToast(message, false)
    }
  };

  /**
   * Carga los valores del area en el formulario dado el id
   * @param {number} id identificador del area
   */
  const getAreaById = async (id) => {
    let area = await AreaService.getArea(id);
    setForm({ ...area });
  }

  useEffect(() => {
    if (isEdit) {
      getAreaById(idArea);
    }
  }, []);

  return (
    <div className='pt-4'>
      <Container className='w-50 mx-auto'>
        <h3 className='my-3 text-center mb-4'>{isEdit ? "ACTUALIZAR AREA" : "NUEVA AREA"}</h3>
        <Form onSubmit={handleSubmit}>
          <Alert show={showAlert} variant='danger'>Aseg??rese de completar todos los campos</Alert>
          <Form.Group as={Row} className="mb-3" controlId="code">
            <Form.Label column sm={4} className='text-start'>
              C??digo:
            </Form.Label>
            <Col sm={5}>
              <Form.Control type="text" name='code' value={form.code} maxLength={20} onChange={handleForm} />
              <Form.Text className="text-muted">
                Max. 20 caracteres
              </Form.Text>
            </Col>
          </Form.Group>
          <Form.Group as={Row} className="mb-3" controlId="name">
            <Form.Label column sm={4} className='text-start'>
              Nombre:
            </Form.Label>
            <Col sm={8}>
              <Form.Control type="text" name='name' value={form.name} maxLength={100} onChange={handleForm} />
            </Col>
          </Form.Group>
          <Form.Group as={Row} className="mb-3" controlId="price">
            <Form.Label column sm={4} className='text-start'>
              Precio:
            </Form.Label>
            <Col sm={8}>
              <Form.Control type="number" name='price' value={form.price} onChange={handleForm} />
            </Col>
          </Form.Group>
          <Button variant='primary' type='submit' className='float-end'>{isEdit ? "Actualizar" : 'Guardar'}</Button>
        </Form>
      </Container>
    </div>
  )
}
