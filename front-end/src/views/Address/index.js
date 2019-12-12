import React from 'react'
import { Table } from 'antd';
import Axios from 'axios';
import { GET_DATA_URL } from '../../constant';

const columns = [
  {
    title: 'Province',
    dataIndex: 'name',
    key: 'name',
  },
  {
    title: 'Population',
    dataIndex: 'population',
    key: 'population',
    width: '30%',
  },
];

class Address extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      expandedRowKeys: [],
      datasource: [],
      loading: true,
      getedDistrict: []
    }
  }

  componentDidMount() {
    this.getListProvinces()
  }

  getListProvinces = async () => {
    try {
      const response = await Axios({
        url: GET_DATA_URL + "/get_provinces",
        method: "GET"
      })
      const fnsGetProvincePopulations = response.data.map(province => this.getProvincePopulation(province.id))
      const provincePopulations = await Promise.all(fnsGetProvincePopulations);
      const datasource = response.data.map((province, index) => {
        return {
          key: province.id,
          name: province.name,
          population: provincePopulations[index],
          districts: []
        }
      })
      this.setState({ datasource, loading: false })
    } catch (error) {

    }
  }

  getProvincePopulation = async (id) => {
    try {
      const response = await Axios({
        url: `${GET_DATA_URL}/province_population?province_id=${id}`,
        method: "GET",
      })
      return response.data.population
    } catch (error) {

    }
  }

  getDistrictPopulation = async (proId, disId) => {
    try {
      const response = await Axios({
        url: `${GET_DATA_URL}/district_population?province_id=${proId}&district_id=${disId}`,
        method: "GET",
      })
      return response.data.population
    } catch (error) {

    }
  }

  getDistrict = async (id) => {
    try {
      const response = await Axios({
        url: GET_DATA_URL + "/get_districts?province_id=" + id,
        method: "GET",
      })
      return response.data
    } catch (error) {

    }
  }

  onExplandedProvince = async (expanded, record) => {
    const expandedRowKeys = this.state.expandedRowKeys;
    if (expanded) {
      expandedRowKeys.push(record.key);

      if (this.state.getedDistrict.includes(record.key)) {
        return this.setState({ expandedRowKeys })
      }

      this.setState({ loading: true })

      const districts = await this.getDistrict(record.key)

      const fnsGetDistrictPopulations = districts.map(district => this.getDistrictPopulation(record.key, district.id));
      const districtPopulations = await Promise.all(fnsGetDistrictPopulations);

      const districtsMap = districts.map((district, index) => ({
        key: district.id,
        name: district.name,
        population: districtPopulations[index]
      }))

      const datasource = this.state.datasource.map(province => {
        if (province.key === record.key) {
          province.districts = districtsMap
        }
        return province
      })

      const getedDistrict = this.state.getedDistrict;
      getedDistrict.push(record.key);

      return this.setState({ expandedRowKeys, datasource, getedDistrict, loading: false })
    }
    expandedRowKeys.splice(expandedRowKeys.indexOf(record.key), 1)
    return this.setState({ expandedRowKeys })
  }

  render() {
    return (
      <div style={{ width: "60%", margin: "auto" }}>
        <Table
          loading={this.state.loading}
          columns={columns}
          dataSource={this.state.datasource}
          onExpand={this.onExplandedProvince}
          expandedRowKeys={this.state.expandedRowKeys}
          expandedRowRender={(record) => {
            const rowColumns = [
              {
                title: 'District',
                dataIndex: 'name',
                key: 'name',
              },
              {
                title: 'Population',
                dataIndex: 'population',
                key: 'population',
                width: '30%',
              },
            ];
            return <Table columns={rowColumns} dataSource={record.districts} pagination={false} />
          }}
        />
      </div>
    )
  }
}

export default Address