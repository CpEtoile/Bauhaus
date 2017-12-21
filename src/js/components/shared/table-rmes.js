import React from 'react';
import { BootstrapTable, TableHeaderColumn } from 'react-bootstrap-table';
import './table-rmes.css';

function TableRmes({
	rowParams,
	data,
	search,
	pagination,
	cssClass,
	csvFileName,
	onRowClick,
}) {
	const options = {
		sizePerPage: 5,
		noDataText: 'Aucunes données',
		sizePerPageList: [
			{
				text: '5',
				value: 5,
			},
			{
				text: '10',
				value: 10,
			},
			{
				text: 'Tous',
				value: data.length,
			},
		],
		exportCSVText: 'Exporter en CSV',
		onRowClick: onRowClick,
	};
	const rows = rowParams.map(
		({ dataField, label, width, isKey, dataFormat, dataSort }) => (
			<TableHeaderColumn
				key={label}
				width={width}
				dataField={dataField}
				isKey={isKey}
				dataAlign="center"
				dataFormat={dataFormat}
				dataSort={dataSort}
			>
				{label}
			</TableHeaderColumn>
		)
	);
	return (
		<div className={cssClass} style={{ marginTop: '2%' }}>
			<BootstrapTable
				exportCSV={csvFileName}
				csvFileName={csvFileName}
				data={data}
				striped={true}
				hover={true}
				headerStyle={{ background: '#457DBB', color: 'white' }}
				search={search}
				searchPlaceholder="Rechercher dans le tableau"
				pagination={pagination}
				options={options}
			>
				{rows}
			</BootstrapTable>
		</div>
	);
}

export default TableRmes;
