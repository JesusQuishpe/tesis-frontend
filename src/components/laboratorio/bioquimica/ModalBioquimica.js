import React, { useContext } from 'react'
import { Alert, Button, Modal } from 'react-bootstrap';
import LaboratorioContext from '../../../contexts/LaboratorioContext';
import ModalContext from '../../../contexts/ModalContext';
import { ModalPortal } from '../../ModalPortal';
import { BioquimicaForm } from './BioquimicaForm'

export const ModalBioquimica = ({show,closeModal}) => {
    
    console.log("Modal");
    return (
        <div>
            <Modal show={show} onHide={closeModal} dialogClassName='modal-25w' size='lg'>
                <Modal.Header closeButton>
                    <Modal.Title id="exampleModalLabel">Ingresar datos</Modal.Title>
                </Modal.Header>
                <Modal.Body >
                    <Alert variant='info' hidden>
                        Los campos con<span className="text-danger ">&nbsp;*&nbsp;</span>son obligatorios.
                    </Alert>
                    <BioquimicaForm/>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="primary" form='form-bioquimica' type='submit'>
                        Guardar
                    </Button>
                    <Button variant="secondary" onClick={closeModal}>
                        Cancelar
                    </Button>
                </Modal.Footer>
            </Modal>
        </div>
    )
}
