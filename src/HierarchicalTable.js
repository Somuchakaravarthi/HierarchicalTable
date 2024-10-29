import React, { useState, useEffect } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import {TextField,Button} from '@mui/material';

const calculateValue = (children) => {
  return children.reduce((total, child) => total + (child.children ? calculateValue(child.children) : child.value), 0);
};

export const HierarchicalTable = () => {
    const initialData = [
      { id: 'electronics', label: 'Electronics', value: 1500, children: [{ id: 'phones', label: 'Phones', value: 800 }, { id: 'laptops', label: 'Laptops', value: 700 }] },
      { id: 'furniture', label: 'Furniture', value: 1000, children: [{ id: 'tables', label: 'Tables', value: 300 }, { id: 'chairs', label: 'Chairs', value: 700 }] }
    ];
  
    const [rows, setRows] = useState(initialData);
    const [inputValue, setInputValue] = useState({});
    const [originalData] = useState(initialData);
  
    useEffect(() => {
      setRows(rows.map(row => ({
        ...row,
        value: calculateValue(row.children)
      })));
    }, []);
  
    const handleInputChange = (rowId, childId, value) => {
      setInputValue(prev => ({ ...prev, [`${rowId}-${childId}`]: value }));
    };
  

  
  
    const handleAllocationPercentage = (rowId, childId) => {
      const percentage = parseFloat(inputValue[`${rowId}-${childId}`]) ||0;
      setRows(
        rows.map(row =>
          row.id === rowId
            ? {
                ...row,
                children: row.children.map(child =>
                  child.id === childId 
                    ? { ...child, value: child.value + (child.value * (percentage / 100)) }
                    : child
                ),
                value: calculateValue(row.children.map(child =>
                  child.id === childId 
                    ? { ...child, value: child.value + (child.value * (percentage / 100)) }
                    : child
                ))
              }
            : row
        )
      );
      setInputValue(prev => ({ ...prev, [`${rowId}-${childId}`]: '' }));
    };
  
    const handleAllocationValue = (rowId, childId) => {
      const newValue = parseFloat(inputValue[`${rowId}-${childId}`]) || 0;
      if(newValue !==0){
      setRows(
        rows.map(row =>
          row.id === rowId
            ? {
                ...row,
                children: row.children.map(child =>
                  child.id === childId 
                    ? { ...child, value: newValue }
                    : child
                ),
                value: calculateValue(row.children.map(child =>
                  child.id === childId 
                    ? { ...child, value: newValue }
                    : child
                ))
              }
            : row
        )
      );
      setInputValue(prev => ({ ...prev, [`${rowId}-${childId}`]: '' }));
      }
    };
  
    const calculateGrandTotal = () => {
      return rows.reduce((total, row) => total + row.value, 0);
    };
  
    const getVariancePercentage = (rowId, childId, newValue) => {
      const originalRow = originalData.find(row => row.id === rowId);
      const originalChild = originalRow ? originalRow.children.find(child => child.id === childId) : undefined;
      return originalChild ? ((newValue - originalChild.value) / originalChild.value) * 100 : 0;
    };
  
    return (
      <div className="container mt-5">
        <h1 className="mb-4">Hierarchical Table</h1>
        <table className="table table-bordered">
          <thead>
            <tr>
              <th>Label</th>
              <th>Value</th>
              <th>Variance %</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {rows.map(row => (
              <React.Fragment key={row.id}>
                <tr>
                  <td>{row.label}</td>
                  <td>{row.value}</td>
                  <td></td>
                  <td></td>
                </tr>
                {row.children.map(child => (
                  <tr key={child.id}>
                    <td>{`-- ${child.label}`}</td>
                    <td>{child.value}</td>
                    <td>{getVariancePercentage(row.id, child.id, child.value).toFixed(2)}%</td>
                    <td>
                      <TextField
                        type="number"
                        placeholder="Enter value "
                        value={inputValue[`${row.id}-${child.id}`] || ''}
                        onChange={(e) => handleInputChange(row.id, child.id, e.target.value)}
                        variant="outlined"
                        size="small"
                      />
                      <Button style={{marginLeft:'2rem'}}
                        variant="contained" 
                        color="primary"
                        onClick={() => handleAllocationPercentage(row.id, child.id)}
                      >
                        Allocation %
                      </Button>
                      <Button  style={{marginLeft:'2rem'}}
                        variant="contained" 
                        color="secondary"
                        onClick={() => handleAllocationValue(row.id, child.id)}
                      >
                        Allocation Val
                      </Button>
         
                    </td>
                  </tr>
                ))}
              </React.Fragment>
            ))}
            <tr>
              <td><strong>Grand Total</strong></td>
              <td><strong>{calculateGrandTotal()}</strong></td>
              <td></td>
              <td></td>
            </tr>
          </tbody>
        </table>
      </div>
    );
  };
  
