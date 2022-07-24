import React, {useMemo} from 'react'
import {Button, FormControl, InputLabel, OutlinedInput, MenuItem, Select, Typography} from '@mui/material';

export const DisplayFilters = (props) => {
    
  return (
    <div>

    <div style={{display: 'flex', justifyContent: 'space-between'}}>
    <div style={{height: "30%"}}>
    <Button variant="contained" color="primary" onClick={() => props.sortByQuery("popularity") } >
        Popularity
    </Button>
    <Button style={{marginLeft: 5}} variant="contained" color="primary" onClick={() => props.sortByQuery("recent")}>
        Recent
    </Button>
    <Button style={{marginLeft: 5}} variant="contained" color="primary" onClick={() => props.sortByQuery("alphabetical")}>
        Alphabetical
    </Button>
    </div>
    <FormControl>
    <InputLabel htmlFor="search">Search for song</InputLabel>
        <OutlinedInput
        id="search"
        label="search"
        type="text"
        onChange={(e) => props.searchForSong(e)}
        />
    </FormControl>
    <FormControl sx={{ m: 1, width: 300 }}>
        <InputLabel id="demo-multiple-name-label">Filter Tags</InputLabel>
        <Select
        labelId="demo-multiple-name-label"
        id="demo-multiple-name"
        multiple
        value={props.selectedTags}
        onChange={(e) => {
            props.setSelectedTags(
            // On autofill we get a stringified value.
            typeof e.target.value === 'string' ? e.target.value.split(',') : e.target.value,
        )}}
        input={<OutlinedInput label="Name" />}
        >
        {props.tagsList.map((tag) => (
            <MenuItem
            key={tag}
            value={tag}
            >
            {tag}
            </MenuItem>
        ))}
        </Select>
    </FormControl>
    </div>
    </div>

  )
}

