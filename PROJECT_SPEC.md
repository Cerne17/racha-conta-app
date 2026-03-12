# Especificação Técnica: App Racha-Conta (Agentic Flow)

## Visão Geral
Aplicação mobile para divisão de despesas de restaurante em tempo real, utilizando HTML/JS/CSS (React Native/Expo).

## 1. Requisitos Funcionais (RF)
- **RF01 - Criação de Sala:** Gerar um ID único e um código de 6 dígitos para cada mesa/grupo.
- **RF02 - Sistema de Convite:** Gerar URLs (Deep Links) que abrem o app diretamente na sala específica.
- **RF03 - Entrada via Código:** Permitir ingresso manual via código numérico (estilo Kahoot).
- **RF04 - Gestão de Itens:** Adição de produtos com nome, preço e quem consumiu.
- **RF05 - Dashboard de Divisão:** Mostrar em tempo real o "Quanto eu devo" vs "Total da Mesa".

## 2. Requisitos Não Funcionais (RNF)
- **RNF01 - Latência:** Atualização de dados em < 500ms (Supabase ou Convex).
- **RNF02 - Offline First:** O app deve permitir adicionar itens mesmo sem rede, sincronizando ao voltar.
- **RNF03 - UI/UX:** Interface minimalista focada em uso rápido (ambiente de restaurante).

## 3. Regras de Negócio (RN)
- **RN01:** O código de 6 dígitos expira após 12 horas de inatividade da sala.
- **RN02:** Apenas o "Host" (criador) pode fechar a conta final, mas todos podem adicionar itens.
- **RN03:** O cálculo deve suportar divisão proporcional (ex: uma pizza dividida por 3 pessoas).
- **RN04 - Modalidades de Divisão de Conta:** Divisão igualitária, ou por consumo individual.
- **RN05 - Modalidade de Divisão de Gorjeta:**Divisão igualitária dos 10% ou divisão proporcional dos 10% em relação ao consumo individual (configuradas pelo criador da sala).