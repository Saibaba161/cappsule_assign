import { useEffect, useState } from 'react';
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
//import Typography from '@mui/material/Typography'
import { Grid, ThemeProvider, createTheme } from '@mui/material';

const theme = createTheme({
    typography: {
        fontFamily: 'Poppins',
    },
});

export default function Data({ searchQuery }) {
    const [searchResults, setSearchResults] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(`https://backend.cappsule.co.in/api/v1/new_search?q=${searchQuery}&pharmacyIds=1,2,3`);
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        const data = await response.json();
        setSearchResults(data.data.saltSuggestions);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    if(searchQuery) {
      fetchData();
    }
  }, [searchQuery]);

  return (
    <ThemeProvider theme={theme}>
    <div style={{ margin: '20px' }}>
    <Grid container spacing={2} justifyContent="center">
        {Array.isArray(searchResults) && searchResults.map((result) => (
            <Grid item key={result.id}>
                <Card style={{ minWidth: '1400px', borderRadius: '10px', boxShadow: '0px 4px 10px rgba(0, 0, 0, 0.3)', background: 'linear-gradient(to right, #ffffff, #eafcf2)' }}>
                    <CardContent>
                    <Grid container direction="column" spacing={3}>
                        <Grid item>
                            <strong>Name: {result.salt}</strong>
                        </Grid>
                        <Grid item>
                            <span>Form: {result.most_common.Form}</span>
                        </Grid>
                        <Grid item>
                            <span>Strength: {result.most_common.Strength}</span>
                        </Grid>
                        <Grid item>
                            <span>Packaging: {result.most_common.Packing}</span>
                        </Grid>
                    </Grid>
                    </CardContent>
                </Card>
            </Grid>
        ))}
    </Grid>
</div>
</ThemeProvider>
  );
}
