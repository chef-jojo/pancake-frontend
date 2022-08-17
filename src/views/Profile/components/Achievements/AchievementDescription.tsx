import { Text, TextProps } from '@pancakeswap/uikit'
import { useTranslation } from '@pancakeswap/localization'
import { TranslatableText as AchievementDescriptionType } from 'config/constants/types'
import styled from '@pancakeswap/styled'

interface AchievementDescriptionProps extends TextProps {
  description?: AchievementDescriptionType
}

const Description = styled(Text)`
  display: none;

  ${({ theme }) => theme.mediaQueries.md} {
    display: block;
  }
`

Description.defaultProps = {
  as: 'p',
}

const AchievementDescription: React.FC<React.PropsWithChildren<AchievementDescriptionProps>> = ({
  description,
  ...props
}) => {
  const { t } = useTranslation()

  if (!description) {
    return null
  }

  if (typeof description === 'string') {
    return (
      <Text as="p" color="textSubtle" fontSize="14px" {...props}>
        {description}
      </Text>
    )
  }

  const { key, data = {} } = description

  return (
    <Description color="textSubtle" fontSize="14px" {...props}>
      {t(key, data)}
    </Description>
  )
}

export default AchievementDescription
