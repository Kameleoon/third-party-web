import React, {Suspense, useState} from 'react'
import classNames from 'classnames'
import startCase from 'lodash/startCase'

import SEO from '../components/seo'
import DataTable from '../components/data-visualizations/data-table'

const KeyValuePair = ({label, value}) => {
  return (
    <div className={`label-value-pair label-value-pair--${label.toLowerCase()}`}>
      <span className="label">{label}</span>
      <span className="value">{value}</span>
    </div>
  )
}

const EntityViewer = ({selectedEntity}) => {
  if (!selectedEntity) return null
  const {
    name,
    company,
    homepage,
    categories,
    totalOccurrences,
    averageExecutionTime,
    domains,
  } = selectedEntity

  return (
    <div className="selected-entity">
      <h2>{name}</h2>
      <KeyValuePair label="Company" value={company} />
      <KeyValuePair label="Category" value={startCase(categories[0])} />
      {homepage ? (
        <KeyValuePair
          label="Homepage"
          value={
            <a href={homepage} target="_blank" rel="noopener noreferrer">
              {homepage}
            </a>
          }
        />
      ) : null}
      <KeyValuePair label="Total Occurrences" value={totalOccurrences.toLocaleString()} />
      {averageExecutionTime ? (
        <KeyValuePair label="Average Impact" value={averageExecutionTime.toFixed(0) + ' ms'} />
      ) : null}
      <KeyValuePair label="Domains" value={domains.join('\n')} />
    </div>
  )
}

const EntityData = thirdPartyWeb => ({selectedEntity, setSelectedEntity}) => {
  const {entities} = thirdPartyWeb

  return (
    <>
      <div className="entity-data__search">
        <input
          type="text"
          placeholder="search for an entity..."
          ariaLabel="Search input text to find an entity"
        />
      </div>
      <div className="entity-data__data-view">
        <div className="data-table-wrapper">
          <DataTable
            entities={entities}
            selectedEntity={selectedEntity}
            onEntityClick={entity => setSelectedEntity(entity)}
          />
        </div>
        <EntityViewer selectedEntity={selectedEntity} />
      </div>
    </>
  )
}

const EntityDataPage = () => {
  const [selectedEntity, setSelectedEntity] = useState()
  const loader = <div className="loader-ring" />

  let element = loader
  if (typeof window !== 'undefined') {
    const LazyView = React.lazy(() =>
      import('third-party-web').then(thirdPartyWeb => {
        const View = EntityData(thirdPartyWeb)
        return {
          default: props => <View {...props} />,
        }
      })
    )

    element = (
      <Suspense fallback={loader}>
        <LazyView selectedEntity={selectedEntity} setSelectedEntity={setSelectedEntity} />
      </Suspense>
    )
  }

  return (
    <>
      <SEO title="Data" keywords={['third-party', 'report', 'web', 'lighthouse', 'HTTPArchive']} />
      <div className="entity-data transparent-container">
        <h1>Entity Data</h1>
        {element}
      </div>
    </>
  )
}

export default EntityDataPage
