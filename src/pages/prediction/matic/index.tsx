import { createNetworkGuard } from 'components/NetworkGuard'

function PredictionChain() {
  return <div>test</div>
}

PredictionChain.NetworkGuard = createNetworkGuard(137)

export default PredictionChain
