import TextField from '@mui/material/TextField';
import Autocomplete from '@mui/material/Autocomplete';
import IconButton from '@mui/material/IconButton';
import SearchIcon from '@mui/icons-material/Search';
import Divider from '@mui/material/Divider';

import Data from '../data';
import { useState } from 'react';

export default function FreeSolo() {
  const [searchQuery, setSearchQuery] = useState('')


  return (
    <div style={{display: 'flex', flexDirection: 'column', alignItems: 'center'}}>
      <div>
      <Autocomplete
        sx={{
          width: 1400
        }}
        freeSolo
        id="free-solo-2-demo"
        variant='outlined'
        disableClearable
        options={[]}

        onChange={(event) => setSearchQuery(event.target.value)}
        value={searchQuery}
        renderInput={(params) => (
          <TextField
            {...params}
            label="Type your medicine name here"
            InputProps={{
              ...params.InputProps,
              type: 'search',
              endAdornment: (
                <IconButton type="submit" aria-label="search">
                  <SearchIcon />
                </IconButton>
              ),
            }}
          />
        )}
      />
      </div>
          <Divider style={{ width: '90%', marginBottom:'30px', marginTop: '30px' }}/>
          {searchQuery && <Data searchQuery={searchQuery} />}
      </div>
  );
}