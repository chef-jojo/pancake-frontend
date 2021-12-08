import React from 'react'
import styled from 'styled-components'
import {
  BlockIcon,
  CheckmarkCircleIcon,
  Flex,
  CrownIcon,
  Text,
  TeamPlayerIcon,
  TrophyGoldIcon,
  Skeleton,
} from '@pancakeswap/uikit'
import { useTranslation } from 'contexts/Localization'
import { UserTradingInformationProps } from '../../types'
import { useCompetitionRewards, getRewardGroupAchievements } from '../../helpers'
import { BoldTd, Td, StyledPrizeTable } from '../StyledPrizeTable'

const StyledThead = styled.thead`
  border-bottom: 2px solid ${({ theme }) => theme.colors.cardBorder};
`

const UserPrizeGrid: React.FC<{ userTradingInformation?: UserTradingInformationProps }> = ({
  userTradingInformation,
}) => {
  const { t } = useTranslation()
  const {
    userRewardGroup,
    userCakeRewards,
    userLazioRewards,
    userPortoRewards,
    userSantosRewards,
    userPointReward,
    canClaimNFT,
  } = userTradingInformation
  const { cakeReward, lazioReward, portoReward, santosReward, dollarValueOfTokensReward } = useCompetitionRewards({
    userCakeRewards,
    userLazioRewards,
    userPortoRewards,
    userSantosRewards,
  })

  const { champion, teamPlayer, trophy } = getRewardGroupAchievements(userRewardGroup)

  return (
    <StyledPrizeTable>
      <StyledThead>
        <tr>
          <th>{t('Token Prizes')}</th>
          <th>{t('Achievements')}</th>
          <th>{t('NFT')}</th>
        </tr>
      </StyledThead>
      <tbody>
        <tr>
          <BoldTd>
            <Flex flexDirection="column">
              <Text bold>{cakeReward.toFixed(2)} CAKE</Text>
              <Text bold>{lazioReward.toFixed(2)} LAZIO</Text>
              <Text bold>{portoReward.toFixed(2)} PORTO</Text>
              <Text bold>{santosReward.toFixed(2)} SANTOS</Text>
              {dollarValueOfTokensReward !== null ? (
                <Text fontSize="12px" color="textSubtle">
                  ~{dollarValueOfTokensReward} USD
                </Text>
              ) : (
                <Skeleton height={24} width={80} />
              )}
            </Flex>
          </BoldTd>
          <Td>
            <Flex alignItems="center" flexWrap="wrap" justifyContent="center" width="100%">
              {champion && <CrownIcon mr={[0, '4px']} />}
              {teamPlayer && <TeamPlayerIcon mr={[0, '4px']} />}
              {trophy && <TrophyGoldIcon mr={[0, '4px']} />}
              <Text fontSize="12px" color="textSubtle" textTransform="lowercase">
                + {userPointReward} {t('Points')}
              </Text>
            </Flex>
          </Td>
          <Td>{canClaimNFT ? <CheckmarkCircleIcon color="success" /> : <BlockIcon color="textDisabled" />}</Td>
        </tr>
      </tbody>
    </StyledPrizeTable>
  )
}

export default UserPrizeGrid
