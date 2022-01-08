import axios from 'axios';
import React, { useContext, useState } from 'react'
import { Button, Col, Form, Row } from 'react-bootstrap'
import { Link, useNavigate } from 'react-router-dom'
import { UserContext } from '../../contexts/UserContext';
import { END_POINT } from '../../utils/conf';

export const Login = () => {
    const navigate = useNavigate();
    const {user,setUser} = useContext(UserContext);

    const initialForm = {
        email: "",
        password: ""
    };
    const [form, setForm] = useState(initialForm);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setForm({
            ...form,
            [name]: value
        });
    };

    const handleClick = async (e) => {
        try {
            if(!user){
                let response = await axios.post(END_POINT + "login", form);
                setUser(response.data.user);
                console.log(response);
            }
            navigate("/caja");
        } catch (error) {
            if(error.response.status===422){
                alert("Debe proporcionar un correo valido");
                return;
            }
            if(error.response.status===401){
                alert("Error las credenciales");
                return;
            }
            
        }
    };
    return (
        <div className='d-flex justify-content-center align-items-center min-vh-100'>
            <Form className='w-50 border  shadow p-4'>
                <h2 className='mb-4'>Login</h2>
                <Form.Group as={Row} className="mb-3" controlId="email">
                    <Form.Label as={Col} className='text-start'>
                        Correo electrónico:
                    </Form.Label>
                    <Col>
                        <Form.Control type="text" name='email' value={form.email} onChange={handleChange} />
                    </Col>
                </Form.Group>
                <Form.Group as={Row} className="mb-3" controlId="password">
                    <Form.Label as={Col} className='text-start'>
                        Contraseña:
                    </Form.Label>
                    <Col>
                        <Form.Control type="text" name='password' value={form.password} onChange={handleChange} />
                    </Col>
                </Form.Group>
                <div className='d-flex justify-content-end'>
                    <Button onClick={handleClick}>Login</Button>
                </div>
            </Form>
        </div>
    )
}