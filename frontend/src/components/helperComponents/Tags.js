import * as React from 'react';
import { styled } from '@mui/material/styles';
import Chip from '@mui/material/Chip';
import Paper from '@mui/material/Paper';
import { OutlinedInput, InputLabel, IconButton } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
const ListItem = styled('li')(({ theme }) => ({
  margin: theme.spacing(0.5),
}));

export default function ChipsArray(props) {
  const [chipData, setChipData] = React.useState([
    { key: 0, label: 'Boogie Woogie' },
  ]);
  const [newTag, setNewTag] = React.useState('');

  const handleDelete = (chipToDelete) => () => {
    setChipData((chips) => chips.filter((chip) => chip.key !== chipToDelete.key));
    props.setTags(chipData.map((chip) => chip.label));

  };
  const createNewTag = () => {
    setChipData((chips) => [...chips, { key: chips.length, label: newTag }]);
    props.setTags(chipData.map((chip) => chip.label));
    setNewTag('');
  }
  return (
    <Paper
      sx={{
        display: 'flex',
        justifyContent: 'center',
        flexWrap: 'wrap',
        listStyle: 'none',
        p: 0.5,
        m: 0,
      }}
      component="ul"
    >
      {chipData.map((data) => {
        return (
          <ListItem key={data.key}>
            <Chip
              label={data.label}
              onDelete={handleDelete(data)}
            />
          </ListItem>
        );
      })}
      <div>
      <InputLabel htmlFor="tag">Tags</InputLabel>
        <OutlinedInput
        id="tag"
        value={newTag}
        label="Tag"
        onChange={(e) => setNewTag(e.target.value)}
        />
        {chipData.length < 5 && chipData.every((chip) => chip.label.toLowerCase() !== newTag.toLowerCase()) &&
          <IconButton aria-label="add song" onClick={() => createNewTag()} >
              <AddIcon />
          </IconButton>
        }
      </div>
    </Paper>
  );
}
