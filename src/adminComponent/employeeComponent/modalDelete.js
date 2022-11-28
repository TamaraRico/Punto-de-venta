import * as React from "react";
import Button from "@mui/material/Button";
import swal from 'sweetalert';

import TextField from "@mui/material/TextField";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import { Grid } from "@mui/material";

// Variables para los datos del usuario

export default function ModalDelete() {
    const [open, setOpen] = React.useState(false);
  
    const handleClickOpen = (event) => {
      event.preventDefault();
      setOpen(true);
    };
  
    const handleClose = (event) => {
      event.preventDefault();
      setOpen(false);
    };
  
    const handleDeleteEmployee = (event) => {
        event.preventDefault();
        var user = window.document.getElementById('name').value;
        console.log(user)
        if((user != '')) {
            window.api.send('user:load',user);
            window.api.receive('user:get', (data) => {     
                const data2 = JSON.parse(data);
                if(data2 != null){
                    var answer = window.confirm("Eliminar usuario "+user+"?");
                    if(answer){
                        if(data2.role != 'administrator'){
                            window.api.send('user:delete', user);
                            swal({
                                title: 'Exito!',
                                text: 'Borrado con exito!',
                                icon: 'success',
                                confirmButtonText: 'Cerrar'
                            })
                            window.api.send('user:fetch');
                            window.api.receive('user:fetch',  async (data) => {
                                setOpen(false);
                            });
                            setOpen(false);
                        } else {
                            swal({
                                title: 'Error!',
                                text: 'Es un usuario Administrador',
                                icon: 'error',
                                confirmButtonText: 'Cerrar'
                            }) 
                        }
                    }
                } else {
                    swal({
                        title: 'Error!',
                        text: 'Ususario no existe',
                        icon: 'error',
                        confirmButtonText: 'Cerrar'
                    })   
                }
            });     
        } else {
            swal({
                title: 'Error!',
                text: 'Falta algun campo!',
                icon: 'error',
                confirmButtonText: 'Cerrar'
            })
        }
    }   
  
    return (
      <div>
        <Button variant="outlined" onClick={handleClickOpen}>
          Eliminar Empleado
        </Button>
        <Dialog open={open} onClose={handleClose}>
          <DialogTitle>Eliminar a un Empleado</DialogTitle>
          <DialogContent>
            <DialogContentText>
              Verificar correctamente todos los campos
            </DialogContentText>
            <Grid container spacing={2}>
              <Grid item xs={12} md={6}>
                <TextField fullWidth autoFocus margin="dense" id="name" label="Nombre" type="text" variant="filled" />
              </Grid>
            </Grid>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleClose}>Cerrar</Button>
            <Button onClick={handleDeleteEmployee}>Eliminar</Button>
          </DialogActions>
        </Dialog>
      </div>
    );
}