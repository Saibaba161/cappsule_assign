import { useEffect, useState } from 'react';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import { Grid, ThemeProvider, createTheme } from '@mui/material';
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';


const theme = createTheme({
    typography: {
        fontFamily: 'Poppins',
    },
});

export default function Data({ searchQuery }) {
    const [searchResults, setSearchResults] = useState([]);
    const [lowestPrice, setLowestPrice] = useState({});
    const [selectedForms, setSelectedForms] = useState({});
    const [showAllForms, setShowAllForms] = useState(false);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await fetch(`https://backend.cappsule.co.in/api/v1/new_search?q=${searchQuery}&pharmacyIds=1,2,3`);
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                const data = await response.json();
                setSearchResults(data.data.saltSuggestions);

                let initialSelectedForms = {};
                let updatedLowestPrices = {};

                data.data.saltSuggestions.forEach((suggestion) => {
                    const salt = suggestion.salt;
                    const saltForms = suggestion.salt_forms_json;
                    const defaultForm = 'Tablet';

                    if (saltForms[defaultForm]) {
                        initialSelectedForms[salt] = defaultForm;
                        let currentLowestPrice = null; // Initialize to null

                        const form = saltForms[defaultForm];
                        Object.values(form).forEach((strength) => {
                            Object.values(strength).forEach((packaging) => {
                                Object.values(packaging).forEach((pharmacyData) => {
                                    if (pharmacyData !== null) {
                                        pharmacyData.forEach((item) => {
                                            const currentPrice = item.selling_price;
                                            if (currentLowestPrice === null || currentPrice < currentLowestPrice) {
                                                currentLowestPrice = currentPrice;
                                            }
                                        });
                                    }
                                });
                            });
                        });

                        updatedLowestPrices[salt] = currentLowestPrice;
                    }
                });

                setSelectedForms(initialSelectedForms);
                setLowestPrice(updatedLowestPrices);
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        };

        if (searchQuery) {
            fetchData();
        }
    }, [searchQuery]);

    const handleFormSelection = (salt, form) => {
        setSelectedForms((prevSelectedForms) => ({
            ...prevSelectedForms,
            [salt]: form,
        }));

        const result = searchResults.find((result) => result.salt === salt);
        const saltForms = result.salt_forms_json;
        let currentLowestPrice = null; // Initialize to null

        if (saltForms[form]) {
            const formDetails = saltForms[form];
            Object.values(formDetails).forEach((strength) => {
                Object.values(strength).forEach((packaging) => {
                    Object.values(packaging).forEach((pharmacyData) => {
                        if (pharmacyData !== null) {
                            pharmacyData.forEach((item) => {
                                const currentPrice = item.selling_price;
                                if (currentLowestPrice === null || currentPrice < currentLowestPrice) {
                                    currentLowestPrice = currentPrice;
                                }
                            });
                        }
                    });
                });
            });
        }

        setLowestPrice((prevLowestPrice) => ({
            ...prevLowestPrice,
            [salt]: currentLowestPrice, // Update the lowest price directly
        }));
    };

    return (
        <ThemeProvider theme={theme}>
            <div style={{ margin: '20px' }}>
                <Grid container spacing={2} justifyContent="center">
                    {Array.isArray(searchResults) &&
                        searchResults.map((result) => (
                            <Grid item key={result.id}>
                                <Card style={{ minWidth: '1460px', borderRadius: '10px', boxShadow: '0px 4px 10px rgba(0, 0, 0, 0.3)', background: 'linear-gradient(to right, #ffffff, #e1f5f3)', }}>
                                    <CardContent style={{ fontFamily: 'Montserrat' }}>
                                        <Grid container spacing={5} direction="column" display="grid" gridTemplateColumns="1fr 1fr 1fr">
                                            <Grid item>
                                                <span>Form: </span>
                                                {result.available_forms.slice(0, 3).map((form, index) => (
                                                    <Button
                                                        key={index}
                                                        variant="outlined"
                                                        style={{
                                                            left: '70px',
                                                            color: 'black',
                                                            borderColor: 'black',
                                                            boxShadow: selectedForms[result.salt] === form ? '0 0 0 3px #bcebe4' : 'none',
                                                            marginRight: '10px', // Added marginRight for spacing
                                                        }}
                                                        onClick={() => handleFormSelection(result.salt, form)}
                                                    >
                                                        {form}
                                                    </Button>
                                                ))}
                                                {result.available_forms.length > 3 && (
                                                    <Button
                                                        variant="text"
                                                        style={{
                                                            left: '70px',
                                                            color: 'black',
                                                            borderColor: 'black',
                                                            marginRight: '10px', // Added marginRight for spacing
                                                        }}
                                                        onClick={() => setShowAllForms((prev) => !prev)}
                                                    >
                                                        {showAllForms ? 'Less..' : 'More..'}
                                                    </Button>
                                                )}
                                                {showAllForms &&
                                                    result.available_forms.slice(3).map((form, index) => (
                                                        <Button
                                                            key={index}
                                                            variant="outlined"
                                                            style={{
                                                                left: '70px',
                                                                color: 'black',
                                                                borderColor: 'black',
                                                                boxShadow: selectedForms[result.salt] === form ? '0 0 0 3px #bcebe4' : 'none',
                                                                marginRight: '10px', // Added marginRight for spacing
                                                            }}
                                                            onClick={() => handleFormSelection(result.salt, form)}
                                                        >
                                                            {form}
                                                        </Button>
                                                    ))}
                                            </Grid>

                                            <Grid item></Grid>

                                            <Grid item></Grid>

                                            <Grid item>
                                                <span>Strength: <Button variant='outlined' style={{ left: '40px', color: 'black', borderColor: 'black', boxShadow:'0 0 0 3px #bcebe4' }}>{result.most_common.Strength}</Button></span>
                                            </Grid>

                                            <Grid item alignItems="center" justifyContent="center" display="flex" fontSize="25px">
                                                <strong>{result.salt} </strong>
                                            </Grid>

                                            <Grid item alignItems="center" justifyContent="center" display="flex">
                                                <strong>
                                                    {lowestPrice[result.salt] !== null ? (
                                                        <div style={{ fontSize: '30px' }}><span>From ₹{lowestPrice[result.salt]}</span></div>
                                                    ) : (
                                                        <span><Box sx={{ p: 2, border: "0.5px solid #bce8d6", borderWidth: 'thin', borderRadius: '10px', background: 'white' }}>No stores selling this product near you</Box></span>
                                                    )}
                                                </strong>
                                            </Grid>

                                            <Grid item>
                                                <span>Packaging:<Button variant='outlined' style={{ left: '29px', color: 'black', borderColor: 'black', boxShadow:'0 0 0 3px #bcebe4' }}>{result.most_common.Packing}</Button></span>
                                            </Grid>

                                            <Grid item></Grid>
                                            <Grid item></Grid>
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
