import React, { useContext } from 'react';
import { Redirect } from 'react-router-dom'
import { makeStyles } from '@material-ui/core/styles';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import Grid from '@material-ui/core/Grid';
import DateFnsUtils from '@date-io/date-fns';
import { MuiPickersUtilsProvider, KeyboardDatePicker } from '@material-ui/pickers';
import {database} from '../containers/fire'
import PasswordField from './common/Passwordfield'
import InputAdornment from '@material-ui/core/InputAdornment';
import AccountCircle from '@material-ui/icons/AccountCircle';
import { Loginstate } from '../Provider'

const useStyles = makeStyles(theme => ({
  root: {
    display: 'flex',
    flexWrap: 'wrap',
    textAlign: 'center'
  },
  margin: {
    margin: theme.spacing(1),
    display: 'inline-block'  
  },
    button: {
    margin: theme.spacing(1),
    fontWeight: 'bold',
  },
  buttonset: {
    color: "white",
    margin: '6px',
    fontWeight: 'bold',
    backgroundColor: '#01DF74',
  },
  input: {
    display: 'none',
  },
}));

const CustomizedInputs = (previousPath) => {
  const classes = useStyles();
  const [selectedDate, setSelectedDate] = React.useState(new Date())
  const [User,setUser] = React.useState(null)
  const [Pass,setPass] = React.useState(null)
  const [Fname,setFname] = React.useState(null)
  const [Lname,setLname] = React.useState(null)
  const [gotoHome,setgotoHome] = React.useState(false)
  const [gotoLogin,setgotoLogin] = React.useState(false)
  const { togglestate } = useContext(Loginstate)

function handleDateChange(date) {
  setSelectedDate(date)
}

function getUser(event) {
  setUser(event.target.value)
}

 const getPass = (event) => {
  setPass(event.target.value)
}

function getFname(event) {
  setFname(event.target.value)
}

function getLname(event) {
  setLname(event.target.value)
}

function handlePushData() {
  database.collection('loginDetails'). doc(User). set({ Password: Pass })
  database.collection('personalDetails')
  .add({ FirstName   : Fname,
         LastName    : Lname,
         Username    : User,
         Dateofbirth : selectedDate,
         text        : null
  })
  .then(doc =>{
          setgotoLogin(true)
    console.log("Account Added with id = ",doc.id)
  })   
}

function handlecheckData(){

  database.collection('loginDetails').get()
  .then(snapshot => {
    if (snapshot.empty) {
      console.log('No matching documents.');
      return;
    }

    else
    {
      snapshot.forEach(doc => {
        if(doc.id === User)
        { 
          if(doc.data().Password === Pass)
          {
            togglestate(User)
            setgotoHome(true)
          }
          else
          {
            console.log("Incorrect Password")
          }
        }                   
      });
      return;
    }        
  })
}

function checkLoginDiasbility() {
  console.log(User,Pass)
  if(User === null || Pass === null){
    return false
  }
  else{
    return false
  }
}

return (
    <div className={classes.root}>
    <div>
    {
      previousPath.match === '/login'?
      <div>
          <form autoComplete="off">
            <TextField 
            className={classes.margin} 
            variant="outlined" 
            label="Username"
            onChange={getUser} 
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <AccountCircle />
                </InputAdornment>
              ),
            }}
            /><br/>
            <PasswordField onChangePass={getPass}/>
          </form>

          <div className={classes.button}>        
            <Button variant="outlined" onClick={handlecheckData} className={classes.buttonset}>
              Login
            </Button>

            <Button variant="outlined" href="/createaccount" className={classes.buttonset}>
              Create an account
            </Button>
          </div>

          { gotoHome ? <Redirect to='/' /> :null }
     </div>
    :
     <div>
          <form autoComplete="on=">
            <TextField className={classes.margin} variant="outlined" label="FirstName" onChange={getFname} />
            <TextField className={classes.margin} variant="outlined" label="LastName" onChange={getLname} /><br/>
            <TextField 
            className={classes.margin} 
            variant="outlined" 
            label="Username" 
            onChange={getUser} 
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <AccountCircle />
                </InputAdornment>
              ),
            }}
            />
            <PasswordField onChangePass={getPass}/><br/>
          </form>

      <MuiPickersUtilsProvider utils={DateFnsUtils}>
      <Grid container justify="space-around">
      <KeyboardDatePicker
          margin="normal"
          id="date-picker-dialog"
          label="Date of Birth"
          format="MM/dd/yyyy"
          value={selectedDate}
          onChange={handleDateChange}
          KeyboardButtonProps={{
            'aria-label': 'change date',
          }}
        />
              </Grid>
         </MuiPickersUtilsProvider>
          <div className={classes.button}>
            <Button variant="outlined" onClick={handlePushData} className={classes.buttonset}>
              Create account
            </Button>
        
            <Button variant="outlined"  href="/login" className={classes.buttonset}>
              Already a user
            </Button>
          </div>
            
            { gotoLogin ? <Redirect to='/login' /> : null }
      </div>
    }
    </div>
    </div>
  );
}

export default CustomizedInputs