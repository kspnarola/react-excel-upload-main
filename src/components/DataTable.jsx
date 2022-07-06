import React, { useState, useEffect } from 'react'
import _, { set } from 'lodash';
import styled from "styled-components";
import moment from 'moment'

const generateData = (fileData = []) => {
    let rows = [];
    let columns = fileData.length ? fileData[0] : []
    let colObj = Object.assign({}, columns);
    colObj = Object.fromEntries(Object.entries(colObj).map(a => a.reverse()));

    for (let i = 1; i < fileData.length; i++) {
        const item = fileData[i];
        let obj = { ...colObj }
        Object.keys(obj).map((k, ki) => {
            let isDateString = Date.parse(item[ki]);
            obj[k] = `${item[ki]}`
        })
        rows.push(obj)
    }

    return {
        data: rows,
        columns: columns
    };
};


const DataTable = ({ tableData = [] }) => {
    const [columns, setColumns] = useState([])
    const [data, setData] = useState([])
    const [cols, setCols] = useState(columns);
    const [rows, setRows] = useState(data);
    const [dragStart, setDragStart] = useState("");
    const [displayCols, setDisplayCols] = useState([]);
    const [displayRows, setDisplayRows] = useState([]);


    useEffect(() => {
        const { columns: col, data: mydata } = generateData(tableData);
        setColumns(col);
        setData(mydata)
    }, [tableData])


    useEffect(() => {
        setCols(columns);
    }, [columns])

    useEffect(() => {
        setRows(data);
    }, [data])

    const handleDragStart = (field) => {
        setDragStart(field);
    }

    const handleDrop = (e) => {
        e.preventDefault();
        console.log('Drop', dragStart);
        let newArr = [...displayCols]
        newArr.push(dragStart);
        newArr = _.uniq(newArr)
        setDisplayCols(newArr)
        let newRows = rows.map(item => {
            let final_obj = {};
            let myObj = Object.keys(newArr).map((key, ki) => {
                final_obj[newArr[key]] = item[newArr[key]];
            })
            return final_obj
        })
        setDisplayRows(newRows);
        setDragStart("");
    }

    return (
        <div style={{ display: "flex" }}>
            <ColumnsList className=''>
                <li draggable={false}>Columns</li>
                {cols.map(col => <li draggable onDragStart={() => handleDragStart(col)}>{col}</li>)}
            </ColumnsList>
            <div style={{ height: "500px", width: "100%", overflow: "auto" }} onDrop={handleDrop}>
                {displayCols.length ? <Table>
                    <thead>
                        <tr>
                            {displayCols.map(col => (
                                <th
                                    id={col}
                                    key={col}
                                >
                                    {col}
                                </th>
                            ))}
                        </tr>
                    </thead>
                    <tbody>
                        {displayRows.map((item, i) => <tr>{Object.keys(item).map((k, ki) => <td key={ki}>{item[k]}</td>)}</tr>)}
                    </tbody>
                </Table> : null}
            </div>
        </div>
    )
}

const ColumnsList = styled.ul`
    list-style: none;
    list-style-position: inside;
    padding: 0;
    margin: 0 20px 20px 20px;
    min-width: 200px;
    li {
        padding: 10px;
        border: 3px solid #eef0f5;
        &:first-child {
            background: #eef0f5;
        }
        &:not(:last-child) {
            border-bottom: 0;
        }
    }
`;

const Table = styled.table`
  margin: 0 20px 20px 20px;
  border: 3px solid #eef0f5;
  border-spacing: 0;
  width: 100%;

    thead,tr,th, td {
    position: sticky;
    top: 0;
    z-index: 999;
    
    }

tbody,tr,th, td {
    z-index: 0;
    
}


  thead {
    tr {
        border: 0;
        background: #eef0f5;
        th {
            border: 0;
            padding: 10px;
        }
    }
  }
   
  tr, td, th {
    text-align: left;
    padding: 5px;
  }
`;

const Cell = styled.td`
  font-size: 14px;
  text-align: left;
  text-transform: capitalize;
  vertical-align: center;
  padding: 20px;
  border-bottom: 2px solid #eef0f5;
  border-left: ${({ dragOver }) => dragOver && "5px solid red"};
`;

const StyledTh = styled.th`
  white-space: nowrap;
  color: #716f88;
  letter-spacing: 1.5px;
  font-weight: 600;
  font-size: 14px;
  text-align: left;
  text-transform: capitalize;
  vertical-align: middle;
  padding: 20px;
  border-bottom: 2px solid #eef0f5;
  text-transform: uppercase;
  border-left: ${({ dragOver }) => dragOver && "5px solid red"};
`;

export default DataTable