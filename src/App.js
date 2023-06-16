import React, { useEffect, useState } from 'react';
import './App.css';
import axios from 'axios';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import TablePagination from '@mui/material/TablePagination';
import { Checkbox } from '@mui/material';
import {FormControlLabel} from '@mui/material';
const API_URL = 'https://restcountries.com/v2/all?fields=name,region,area';

const Apps = () => {
  const [data, setData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [filterArea, setFilterArea] = useState(false);
  const [filterRegion, setFilterRegion] = useState(false);
  const [sortedData, setSortedData] = useState([]); // Sorted data array// Sorted data array
  const [sortAlphabetically, setSortAlphabetically] = useState(false); // Checkbox state

  // Function to handle sorting when a checkbox is clicked
  const handleCheckboxClick = () => {
    setSortAlphabetically(!sortAlphabetically);

    // Sort the data array alphabetically based on the name
    const sortedArray = [...data].sort((a, b) => {
      const nameA = a.name.toLowerCase();
      const nameB = b.name.toLowerCase();

      if (sortAlphabetically) {
        return nameA.localeCompare(nameB);
      } else {
        return nameB.localeCompare(nameA);
      }
    });

    setSortedData(sortedArray);
  };
  // Function to handle checkbox click
 




  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    applyFilters();
  }, [data, filterArea, filterRegion]);

  const fetchData = async () => {
    try {
      const response = await axios.get(API_URL);
      setData(response.data);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  const applyFilters = () => {
    let filtered = data;

    if (filterArea) {
      filtered = filtered.filter((country) => country.area < 65300);
    }

    if (filterRegion) {
      filtered = filtered.filter((country) => country.region === 'Oceania');
    }

    setFilteredData(filtered);
    setSortedData(filtered)
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleAreaFilterChange = () => {
    setFilterArea(!filterArea);
  };

  const handleRegionFilterChange = () => {
    setFilterRegion(!filterRegion);
  };

  return (
    <div className='container'>
      <TableContainer>
        <Table sx={{height:'1000px',fontSize:'100px'}} >
            <TableHead sx={{height:'130px' , background:'rgb(96, 194, 194)',position:'sticky'}} >
            <TableRow>
              <TableCell
               sx={{fontSize:'50px',color:'whitesmoke',fontWeight:'bold',fontFamily:'monospace'}}>Name</TableCell>
              <TableCell 
               sx={{fontSize:'50px',color:'whitesmoke',fontWeight:'bold',fontFamily:'monospace'}}>Region</TableCell>
              <TableCell
               sx={{fontSize:'50px',color:'whitesmoke',fontWeight:'bold',fontFamily:'monospace'}}>Area</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
              {(sortedData.length > 0 ? sortedData :filteredData)
                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                .map((country) => (
                  <TableRow key={country.name}>
                    <TableCell>{country.name}</TableCell>
                    <TableCell>{country.region}</TableCell>
                    <TableCell>{country.area}</TableCell>
                  </TableRow>
                ))}
            </TableBody>
        </Table>
      </TableContainer>
      <div className='filter'>
        <Checkbox 
        sx={{marginLeft:'30px'}}
        checked={filterArea} onChange={handleAreaFilterChange} />
        <span>Filter by Area (less than Lithuania)</span>
        <Checkbox 
        sx={{marginLeft:'30px'}}
        checked={filterRegion} onChange={handleRegionFilterChange} />
        <span>Filter by Region (Oceania)</span>
       
        <FormControlLabel
        sx={{'.MuiFormControlLabel-label':{fontSize:'30px' , fontFamily:'monospace'}}}
          control={
            <Checkbox sx={{marginLeft:'30px'}}
              checked={sortAlphabetically}
              onChange={handleCheckboxClick}
              color="primary"
            />
          }
          label="Sort Alphabetically"
        />
       </div>
      <TablePagination
        rowsPerPageOptions={[10, 25, 50]}
        component="div"
        count={filteredData.length }
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
        sx={{'.MuiTablePagination-toolbar':{
          fontSize:'30px',
          fontFamily:'monospace',
        },
          '.MuiTablePagination-selectLabel':{
          fontSize:'30px',
          fontFamily:'monospace'
          },
          '.MuiTablePagination-displayedRows':{
            fontSize:'30px',
            fontFamily:'monospace'
          },
          '.MuiTablePagination-actions .MuiSvgIcon-root':{
            fontSize:'40px',
            fontFamily:'monospace'
          }
        }}
      />
      
    </div>
  );
};

export default Apps;
