/* eslint-env mocha */
'use strict'

const { expect } = require('chai')
const sinon = require('sinon')
const Prometheus = require('prom-client')

const Metrics = require('./metrics')

describe('Metrics', () => {
  let registry
  let metrics

  beforeEach(async () => {
    registry = new Prometheus.Registry()
    metrics = new Metrics({ registry })
  })

  afterEach(async () => {
    sinon.restore()
  })

  it('should store metrics and be able to remove them', async () => {
    metrics.observeSync({
      name: 'foo',
      namespace: 'example',
      backend: 'foo',
      status: 'success'
    })
    expect(await registry.metrics()).to.have.string('kubernetes_external_secrets_sync_calls_count{name="foo",namespace="example",backend="foo",status="success"} 1')
    // Deprecated metric.
    expect(await registry.metrics()).to.have.string('sync_calls{name="foo",namespace="example",backend="foo",status="success"} 1')

    metrics.removeMetricsForGivenES({ name: 'foo', namespace: 'example', backend: 'foo' })
    expect(await registry.metrics()).not.to.have.string('foo')
  })
})
