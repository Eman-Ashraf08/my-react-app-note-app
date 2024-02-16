import React, { useState, useEffect } from 'react';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import { styled } from '@mui/material/styles';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import MoreIcon from '@mui/icons-material/MoreVert';
import Fab from '@mui/material/Fab';
import AddIcon from '@mui/icons-material/Add';
import InputBase from '@mui/material/InputBase';
import ArrowBack from '@mui/icons-material/ArrowBack';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import Checkbox from '@mui/material/Checkbox';
import ClearIcon from '@mui/icons-material/Clear';
import { format } from 'date-fns';
import { Link } from 'react-router-dom';
import { useChecklistContext } from './ChecklistContext';

const FaButton = styled('div')({
  position: 'fixed',
  bottom: 0,
  right: 0,
  margin: '16px',
});

const InputField = styled('div')(({ theme }) => ({
  position: 'relative',
  borderRadius: 5,
  backgroundColor: 'white',
  marginLeft: 0,
  marginTop: 30,
  width: '60%',
  [theme.breakpoints.up('sm')]: {
    marginLeft: theme.spacing(1),
    width: '45%',
  },
  '& .Mui-focused': {
    border: '3px solid #f78205',
  },
}));

const InputFieldTwo = styled('div')(({ theme }) => ({
  position: 'relative',
  borderRadius: 5,
  backgroundColor: 'white',
  marginLeft: 0,
  marginTop: 30,
  width: '70%',
  [theme.breakpoints.up('sm')]: {
    marginLeft: theme.spacing(1),
    width: '45%',
  },
}));


const CenteredContainer = styled('div')({
  display: 'flex',
  justifyContent: 'center',
});

const StyledInputBase = styled(InputBase)(({ theme }) => ({
  color: 'gray',
  width: '100%',
  '& .MuiInputBase-input': {
    padding: theme.spacing(1, 1, 1, 0),
    paddingLeft: `calc(1em + ${theme.spacing(4)})`,
    transition: theme.transitions.create('width'),
    [theme.breakpoints.up('sm')]: {
      width: '12ch',
      '&:focus': {
        width: '20ch',
      },
    },
  },
}));

function AddNotes() {
  const { checklistItems, setChecklistItems } = useChecklistContext();
  const [title, setTitle] = useState('');
  const [totalAmount, setTotalAmount] = useState({});
  const [showArchived, setShowArchived] = useState(false);

  useEffect(() => {
    try {
      const storedItems = JSON.parse(localStorage.getItem('checklistItems')) || [];
      setChecklistItems(storedItems);
    } catch (error) {
      console.error('Error parsing checklistItems from localStorage:', error);
    }
  }, [setChecklistItems]);
  

  useEffect(() => {
    const newTotalAmount = checklistItems.reduce((acc, item) => {
      if (!item.deleted) {
        const itemTitle = item.title || 'Untitled';
        acc[itemTitle] = (acc[itemTitle] || 0) + (item.amount || 0);
      }
      return acc;
    }, {});

    setTotalAmount(newTotalAmount);
  }, [checklistItems]);

 
  const addChecklistItem = () => {
    if (!title.trim()) {
      alert('Please fill the title first');
      return;
    }

    const newItem = { id: Date.now(), title, notes: '', amount: '' };
    const updatedItems = [...checklistItems, newItem];
    setChecklistItems(updatedItems);
    setTotalAmount({
      ...totalAmount,
      [title]: (totalAmount[title] || 0) + (newItem.amount || 0),
    });
    localStorage.setItem('checklistItems', JSON.stringify(updatedItems));
  };

  
  const updateTotalAmount = (items) => {
    const newTotalAmount = items.reduce((sum, item) => sum + (item.amount || 0), 0);
    setTotalAmount(newTotalAmount);
    updateLocalStorage(items);
  };
  
  const updateLocalStorage = (items) => {
    localStorage.setItem('checklistItems', JSON.stringify(items));
  };
  

  const deleteChecklistItem = (id) => {
    const deletedItem = checklistItems.find((item) => item.id === id);
    const updatedItems = checklistItems.map((item) =>
      item.id === id ? { ...item, deleted: true } : item
    );
  
    setChecklistItems(updatedItems);
  
    if (!deletedItem.deleted) {
      setTotalAmount({
        ...totalAmount,
        [deletedItem.title]: (totalAmount[deletedItem.title] || 0) - (deletedItem.amount || 0),
      });
    }
  };


  const calculateTotalSum = (amounts) => {
    return Object.values(amounts).reduce((sum, value) => sum + (parseFloat(value) || 0), 0);
  };
  

  
  const calculateArchivedSum = () => {
    return checklistItems
      .filter((item) => item.checked && !item.deleted)
      .reduce((sum, item) => sum + (item.amount || 0), 0);
  };

    const CheckboxInput = ({ item }) => {
      const [inputValue, setInputValue] = useState(item.notes || "");
      const [amountValue, setAmountValue] = useState(item.amount || "");
  
      const handleInputBlur = (type) => {
        const updatedItems = checklistItems.map((i) => {
          if (i.id === item.id) {
            if (type === 'notes') {
              return { ...i, notes: inputValue };
            } else if (type === 'amount') {
              const newAmount = parseFloat(amountValue) || 0;
              updateTotalAmount([...checklistItems, { ...i, amount: newAmount }]);
              return { ...i, amount: newAmount };
            }
          }
          return i;
        });
        setChecklistItems(updatedItems);
        updateTotalAmount(updatedItems);
      };

      return !item.deleted ? (
        <div style={{ order: item.checked ? 1 : 0 }}>
          <CenteredContainer>
            <InputFieldTwo>
              <Checkbox
                checked={item.checked}
                onChange={() => {
                  const updatedItems = checklistItems.map((i) =>
                    i.id === item.id ? { ...i, checked: !i.checked } : i
                  );
                  setChecklistItems(updatedItems);
                }}
                color="primary"
              />
              <InputBase
                placeholder='Enter notes'
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onBlur={() => handleInputBlur('notes')}
                style={{ flex: 1, marginRight: "0px", width: "30%" }} />
  
              <InputBase
                placeholder="Amount"
                type='number'
                value={amountValue}
                onChange={(e) => setAmountValue(e.target.value)}
                onBlur={() => handleInputBlur('amount')}
                style={{
                  flex: 1,
                  marginRight: "0px",
                  width: "40%",
                  marginLeft: "20px",
                }}
              />
              <IconButton
                onClick={() => deleteChecklistItem(item.id)}
                style={{ color: "gray", marginLeft: -40 }}
              >
                <ClearIcon />
              </IconButton>
              <div style={{ fontSize: '13px', marginTop: '-12px', color: 'gray', marginLeft: '42px' }}>
                 {format(new Date(), 'dd-MMMM-yyyy(h:mm:ss aaaa)')}
           </div>
            </InputFieldTwo>
          </CenteredContainer>
        </div>
      ) : null;
    };
  
  return (
    <div>
      <Box sx={{ flexGrow: 1 }}>
        <AppBar position="static">
          <Toolbar variant="dense" style={{ background: '#f78205' }}>
            <Link to="/">
              <IconButton
                size="large"
                aria-label="go back"
                style={{ color: 'white' }}
              >
                <ArrowBack />
              </IconButton>
            </Link>
            <Typography
              variant="h5"
              noWrap
              component="div"
              sx={{ flexGrow: 1 }}
            >
              Add Notes
            </Typography>
            <IconButton
              size="large"
              aria-label="display more actions"
              edge="end"
              color="inherit"
            >
              <MoreIcon />
            </IconButton>
          </Toolbar>
        </AppBar>
      </Box>
      <div>
        <CenteredContainer>
          <InputField>
            <StyledInputBase
              placeholder="Title"
              inputProps={{ 'aria-label': 'title' }}
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
          </InputField>
        </CenteredContainer>
      </div>
      <div>
        <div>
          <CenteredContainer>
            <h3 style={{ color: 'black' }}>
              <b>Sum: {calculateTotalSum(totalAmount).toFixed(1)}</b>
            </h3>
          </CenteredContainer>
        </div>
        <div>
          <CenteredContainer style={{ flexDirection: 'column', marginBottom: '8px' }}>
            {checklistItems.map((item) => (
              <CheckboxInput key={item.id} item={item} />
            ))}
          </CenteredContainer>
        </div>
      </div>
<div>
  <CenteredContainer>
    <Stack spacing={2} direction="row">
      <Button
        variant="contained"
        style={{ backgroundColor: '#f78205', marginTop: '10px' }}
        onClick={() => setShowArchived(!showArchived)}
      >
        {showArchived ? 'Hide Archived' : 'Show Archived'}
      </Button>
    </Stack>
  </CenteredContainer>
  {showArchived && (
    <div>
      <div>
        <CenteredContainer>
          <h3 style={{ color: 'black' }}>
            <b>Sum : {calculateArchivedSum().toFixed(1)}</b>
          </h3>
        </CenteredContainer>
      </div>
      {checklistItems
        .filter((item) => item.checked && !item.deleted)
        .map((item) => (
          <CheckboxInput key={item.id} item={item} />
        ))}
      
    </div>
  )}
</div>
<div>
        <FaButton>
          <Fab
            aria-label="add"
            onClick={addChecklistItem}
            style={{ background: '#f78205', color: 'white' }}
          >
            <AddIcon />
          </Fab>
        </FaButton>
      </div>
    </div>
  );
}

export default AddNotes;
