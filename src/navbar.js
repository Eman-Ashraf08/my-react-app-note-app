import * as React from 'react';
import { styled, alpha } from '@mui/material/styles';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import InputBase from '@mui/material/InputBase';
import MoreIcon from '@mui/icons-material/MoreVert';
import SearchIcon from '@mui/icons-material/Search';
import Fab from '@mui/material/Fab';
import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';
import Checkbox from '@mui/material/Checkbox';
import { Link } from 'react-router-dom';
import { useChecklistContext } from './ChecklistContext';


const CenteredContainer = styled('div')({
  display: 'flex',
  justifyContent: 'center',
});
const FaButton = styled('div')({ 
  position: 'fixed',
  bottom: 0,
  right: 0,
  margin: '16px',
});
const Search = styled('div')(({ theme }) => ({
position: 'relative',
borderRadius: 20,
backgroundColor: 'white',
'&:hover': {
  backgroundColor: alpha(theme.palette.common.white, 0.25),
},
marginLeft: 0,
marginTop: 30,
width: '60%',
[theme.breakpoints.up('sm')]: {
  marginLeft: theme.spacing(1),
  width: '40%',
},
}));

const SearchIconWrapper = styled('div')(({ theme }) => ({
padding: theme.spacing(0, 2),
height: '100%',
position: 'absolute',
pointerEvents: 'none',
display: 'flex',
alignItems: 'center',
color: 'gray',
justifyContent: 'flex-end', 
width: '90%',
}));


const NoteCard = styled('div')({
  backgroundColor: 'white',
  color: 'black',
  padding: '14px',
  borderRadius: '8px',
  boxShadow: '0 0 10px rgba(0, 0, 0, 0.1)',
  marginBottom: '16px',
  position: 'relative',
  display: 'inline-block',
  margin: '8px',
});

const NoteCardContent = styled('div')({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
});

const NoteDetails = styled('div')({
  fontSize: '20px',
});

const DeleteIconButton = styled(IconButton)({
  position: 'absolute',
  bottom: '1px',
  left: '20px',
  color: 'black',
  position: 'relative',
});

const BoldTitle = styled('h4')({
  fontWeight: 'bold',
  fontSize: '20px',
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

function Navbar() {  
  const { checklistItems, setChecklistItems } = useChecklistContext();


  const groupedItems = {};

checklistItems.forEach(item => {
  if (!groupedItems[item.title]) {
    groupedItems[item.title] = [];
  }
  groupedItems[item.title].push(item);
});


const renderNoteCards = () => {
  const handleDeleteCard = (title) => {
    const updatedItems = checklistItems.filter(item => item.title !== title);
    setChecklistItems(updatedItems);
    localStorage.setItem('checklistItems', JSON.stringify(updatedItems));
  };

  const handleCheckboxChange = (id) => {
    const updatedItems = checklistItems.map(item => {
      if (item.id === id) {
        item.checked = !item.checked;
      }
      return item;
    });
    setChecklistItems(updatedItems);
    localStorage.setItem('checklistItems', JSON.stringify(updatedItems));
  };

  return Object.keys(groupedItems).map(title => (
    <NoteCard key={title}>
      <BoldTitle>{title}</BoldTitle>
      {groupedItems[title].map(subItem => (
        <div key={subItem.id}>
          <NoteCardContent>
            <Checkbox
              key={subItem.id}
              checked={subItem.checked || false}
              onChange={() => handleCheckboxChange(subItem.id)}
            />
            <NoteDetails>
              <p>{subItem.notes}: {subItem.amount}</p>
            </NoteDetails>
          </NoteCardContent>
        </div>
      ))}
      <DeleteIconButton onClick={() => handleDeleteCard(title)}>
        <DeleteIcon />
      </DeleteIconButton>
    </NoteCard>
  ));
 }


return (
  <div>
    <div>
      <Box sx={{ flexGrow: 1 }}>
        <AppBar position="static">
          <Toolbar variant="dense" style={{ background: '#f78205' }}>
            <Typography
              variant="h5"
              noWrap
              component="div"
              sx={{ flexGrow: 1, }}
            >
              Notes
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
    </div>
    <div>
      <CenteredContainer>
        <Search>
          <SearchIconWrapper>
            <SearchIcon />
          </SearchIconWrapper>
          <StyledInputBase
            placeholder="Search…"
            inputProps={{ 'aria-label': 'search' }}
          />
        </Search>
      </CenteredContainer>
    </div>
    <div>
      {renderNoteCards()}
    </div>
    <div>
      <Link to="/addNotes">
        <FaButton>
          <Fab aria-label="add" style={{ background: '#f78205', color: 'white' }}>
            <AddIcon />
          </Fab>
        </FaButton>
      </Link>
    </div>
  </div>
);

}
export default Navbar;
