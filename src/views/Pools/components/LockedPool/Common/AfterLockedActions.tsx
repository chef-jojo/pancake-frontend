import { Message, MessageText, Box, Flex } from '@pancakeswap/uikit'
import { useTranslation } from 'contexts/Localization'
import { VaultPosition } from 'utils/cakePool'

import ConverToFlexibleButton from '../Buttons/ConverToFlexibleButton'
import ExtendButton from '../Buttons/ExtendButton'

// TODO: add type

const AfterLockedActions = ({
  lockEndTime,
  lockStartTime,
  currentLockedAmount,
  stakingToken,
  position,
  isInline = false,
}) => {
  const { t } = useTranslation()

  const msg = {
    [VaultPosition.None]: null,
    [VaultPosition.LockedEnd]:
      'Lock period has ended. We recommend you unlock your position or adjust it to start a new lock.',
    [VaultPosition.AfterBurning]:
      'The lock period has ended. To avoid more rewards being burned, we recommend you unlock your position or adjust it to start a new lock.',
  }

  const Container = isInline ? Flex : Box

  return (
    <Message
      variant="warning"
      mb="16px"
      action={
        <Container mt="8px">
          <ConverToFlexibleButton />
          <ExtendButton
            lockEndTime={lockEndTime}
            lockStartTime={lockStartTime}
            stakingToken={stakingToken}
            currentLockedAmount={currentLockedAmount}
          >
            {t('Renew')}
          </ExtendButton>
        </Container>
      }
    >
      <MessageText>{msg[position]}</MessageText>
    </Message>
  )
}

export default AfterLockedActions
