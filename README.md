# ∫ IEDO Visual — Guia Interativo de Equações Diferenciais Ordinárias

Um site educacional interativo, visual e direto ao ponto para o estudo de **Introdução às Equações Diferenciais Ordinárias (IEDO)**. Desenvolvido com **HTML5, CSS3 e JavaScript puro (Vanilla JS)**, sem dependências pesadas ou frameworks externos, combinando renderização matemática via **KaTeX** e **14 laboratórios de simulação em `<canvas>`** em tempo real.

---

## 🎯 Objetivo e Abordagem Didática

Muitas vezes o estudo de EDOs parece abstrato por focar apenas em manipulações algébricas. Este projeto resolve esse problema estruturando o aprendizado em **4 pilares pedagógicos**:

1. **💡 Contexto Geral ("Foto vs. Filme"):** Antes de qualquer cálculo, uma introdução intuitiva explica o que é uma EDO (uma equação cuja incógnita é uma função inteira $y(t)$ evoluindo no tempo) e onde ela é usada na prática (Engenharia, Medicina, Química/Clima e Finanças).
2. **🚁 Caso Central Condutor (O Drone Autônomo de Exploração):** Para eliminar a abstração, acompanhamos um único sistema real do início ao fim — o projeto de voo, pouso, circuito eletrônico e bateria de um **Drone Autônomo**. Em cada um dos 14 tópicos, um painel dedicado mostra como aquela técnica matemática resolve um problema real do drone.
3. **🧭 Bússola Rápida de Prova:** Um guia visual de reconhecimento imediato (*"Bateu o olho na equação, qual método usar?"*) que direciona diretamente para o método correto.
4. **🔬 14 Laboratórios Visuais Interativos:** Cada tópico possui seu próprio simulador estilo osciloscópio em `<canvas>` com controles deslizantes (*faders*), botões de regime e leitura de telemetria em tempo real.

---

## 📚 Os 14 Tópicos Cobertos e Seus Simuladores

### Módulo 1 · Fundamentos (Tema Coral `#ff6b4a`)
| # | Tópico | Ideia Central | Simulador `<canvas>` e Caso do Drone |
| :---: | :--- | :--- | :--- |
| **1** | **$\left(\frac{dy}{dt}\right)$ — É a Taxa de Variação** | A derivada dita a inclinação da curva $y(t)$ em cada instante ($>0$ sobe, $=0$ estacionária, $<0$ desce). | **Campo de Direções e Reta Tangente:** Arraste o mouse/toque para ver o vetor tangente mudar de cor conforme o velocímetro vertical do drone. |
| **2** | **Teorema de Existência e Unicidade (TEU)** | Condições ($f$ e $\frac{\partial f}{\partial y}$ contínuas) para garantir que um PVI tenha solução única sem cruzamento de curvas. | **Lançador de PVI:** Clique no plano para lançar trajetórias e compare o caso bem-comportado com a quebra de unicidade em $y' = 3y^{2/3}$ ($y=0$ e $y=t^3$). |
| **3** | **Linearidade** | Como distinguir EDOs Lineares ($y, y', y''$ no 1º grau e separados) das Não-Lineares em 2 segundos. | **Raio-X de Superposição:** Compare a soma de soluções $y_1 + y_2$ na equação linear vs. a explosão não-linear em $y'=y^2$ e no pêndulo $\sin(y)$. |

### Módulo 2 · EDOs de 1ª Ordem (Tema Turquesa `#2dd4bf`)
| # | Tópico | Ideia Central | Simulador `<canvas>` e Caso do Drone |
| :---: | :--- | :--- | :--- |
| **4** | **Variáveis Separáveis** | Separar $g(y)\,dy = f(t)\,dt$ e integrar ambos os lados. | **Famílias de Curvas Separáveis:** Alterne entre círculos ($y'=-t/y$), retas ($y'=y/t$) e curva gaussiana de pouso ($y'=2ty$) variando a constante $C$. |
| **5** | **Equações Exatas** | Quando $\frac{\partial M}{\partial y} = \frac{\partial N}{\partial t}$, a solução é a curva de nível de uma função potencial $\Psi(t,y) = C$. | **Mapa Topográfico $\Psi(t,y)=C$:** Explore as curvas de nível de energia constante por onde o drone navega sem gasto extra. |
| **6** | **Semiexata (Fator Integrante $\mu$)** | Quando $M_y \neq N_t$, multiplicamos a EDO por um "óculos corretivo" $\mu(t)$ ou $\mu(y)$ para torná-la Exata. | **Balança de Derivadas Cruzadas:** Ajuste o expoente $\alpha$ em $\mu(y)=y^\alpha$ até equilibrar visualmente a balança $\frac{\partial(\mu M)}{\partial y} = \frac{\partial(\mu N)}{\partial t}$. |
| **7** | **Lineares de 1ª Ordem** | Multiplicar $y' + p(t)y = q(t)$ por $\mu(t) = e^{\int p(t)dt}$ para colapsar na Regra do Produto $(\mu \cdot y)'$. | **Transiente + Estado Estacionário:** Veja múltiplas rotas iniciais do drone convergindo exponencialmente para a altitude de cruzeiro $y_{\text{eq}} = q/p$. |
| **8** | **Bernoulli (Substituição)** | Equação $y' + p(t)y = q(t)y^n$ linearizada pela troca de variável $v = y^{1-n}$. | **Curva Não-Linear $y(t)$ vs. Linearizada $v(t)$:** Visualize simultaneamente a solução logística com teto operacional do drone e sua reta/curva linearizada. |

### Módulo 3 · EDOs de 2ª Ordem (Tema Lima Elétrico `#bef264`)
| # | Tópico | Ideia Central | Simulador `<canvas>` e Caso do Drone |
| :---: | :--- | :--- | :--- |
| **9** | **Equação de Segunda Ordem** | Com aceleração $y''$, são necessárias 2 condições iniciais ($y(t_0)$ e $y'(t_0)$) e 2 soluções LI ($W \neq 0$). | **Lançador de Impacto de Pouso:** Controle de forma independente a compressão inicial $y(0)$ e a velocidade de toque no solo $y'(0)$. |
| **10** | **Homogêneas com Coeficientes Constantes** | O chute $y=e^{rt}$ gera $ar^2+br+c=0$, cujo discriminante $\Delta = b^2-4ac$ define o regime da resposta. | **Plano Complexo + Resposta no Tempo:** Alterne entre $\Delta > 0$ (2 raízes reais), $\Delta = 0$ (raiz dupla $te^{rt}$) e $\Delta < 0$ (raízes complexas $\alpha \pm i\beta$). |
| **11** | **Coeficientes Indeterminados** | Método do "chute inteligente" para $y_p(t)$ quando $g(t)$ é polinômio, exponencial ou seno/cosseno, com regra anti-colisão ($\times t$). | **Simulador de Forçamento e Ressonância:** Compare a vibração normal da hélice com a **Colisão/Ressonância** ($\omega = \omega_0$), onde a amplitude cresce linearmente com $t$. |
| **12** | **Variação de Parâmetros** | Método universal ($y_p = u_1(t)y_1 + u_2(t)y_2$ via Wronskiano) para termos forçantes exóticos como $\sec(t)$ ou $\tan(t)$. | **Pesos Móveis $u_1(t)$ e $u_2(t)$:** Inspecione a solução de $y'' + y = \sec(t)$ entre as assíntotas verticais de $\sec(t)$. |

### Módulo 4 · Modelagem Física (Tema Ouro Âmbar `#fbbf24`)
| # | Tópico | Ideia Central | Simulador `<canvas>` e Caso do Drone |
| :---: | :--- | :--- | :--- |
| **13** | **Modelagem: Sistema Massa-Mola e Circuito RLC** | Equivalência matemática exata entre mecânica ($mx'' + \gamma x' + kx = F(t)$) e elétrica ($Lq'' + Rq' + \frac{1}{C}q = E(t)$). | **Animação Física em Tempo Real:** Mola animada oscilando em sincronia com a curva de carga $q(t)$ do circuito RLC ao variar $\gamma \leftrightarrow R$ e $k \leftrightarrow 1/C$. |
| **14** | **Crescimento e Decaimento $\left(\frac{dP}{dt} = kP\right)$** | Variação proporcional à quantidade atual gera evolução exponencial $P(t) = P_0 e^{kt}$. | **Simulador de Duplicação e Meia-Vida:** Calcule automaticamente o tempo de duplicação ($k>0$, enxame de drones) e a meia-vida ($k<0$, descarga da bateria). |

---

## ✨ Recursos Visuais e Técnicos

- **Design Editorial & Instrumento Científico:**
  - **Modo Escuro ("Observatório Noturno"):** Fundo técnico quadriculado (*blueprint grid*) em obsidiana quente com cartões assimétricos e sombras arquitetônicas deslocadas.
  - **Modo Claro ("Caderno de Engenharia / Papel Pólen"):** Alternância instantânea (`☀/☾`) para paleta editorial clara de alto contraste.
- **Nitidez Retina (High-DPI Canvas):** Todos os 14 elementos `<canvas>` escalam automaticamente com `window.devicePixelRatio` para máxima nitidez em telas 4K, notebooks e smartphones.
- **🎙️ Assistente de Voz Edge TTS (pt-BR-ThalitaNeural) 100% Estático:**
  - Compatibilidade nativa com **GitHub Pages** (sem frameworks, sem build, sem servidores backend ou custos de API).
  - Priorização automática da voz neural **`pt-BR-ThalitaNeural`** do Microsoft Edge TTS (com detecção inteligente e fallback para as melhores vozes em pt-BR do sistema).
  - **Leitura Interativa por Clique:** Quando ativado pelo usuário, clicar em qualquer parágrafo, título, fórmula matemática ou cartão inicia a narração com destaque visual (*reading highlight*) e equalizador animado no dock flutuante.
  - Sanitização fonética inteligente de notações matemáticas e KaTeX (ex: pronúncia correta de $\frac{dy}{dt}$, $y'$, $y''$, $\Delta$, $\mu$, $e^{kt}$, Wronskiano, etc.).
  - Controle completo com botão de parar (`⏹️ Parar`), tecla `Esc` e persistência de preferência no `localStorage`.
- **Totalmente Responsivo e Compatível com Toque:**
  - Layout adaptativo em múltiplos *breakpoints* (`1180px`, `980px`, `640px`).
  - Ponte de eventos *Touch-to-Mouse* nativa nos gráficos interativos para uso no celular/tablet.
  - Barra de busca rápida (`🔍 Filtrar tópico...`), barra superior de progresso de leitura e menu gaveta no mobile.

---

## 🚀 Como Executar

O projeto não requer instalação de pacotes ou servidor de build:

1. Clone o repositório:
   ```bash
   git clone https://github.com/henriquefelisardo/IEDO.git
   ```
2. Abra o arquivo `index.html` diretamente em qualquer navegador moderno.

---

## 📁 Estrutura de Arquivos

```text
IEDO/
├── index.html   # Estrutura semântica, Contexto Geral, Caso Central do Drone, Bússola e 14 Tópicos
├── styles.css   # Sistema de design editorial, temas escuro/claro, animações e responsividade
├── script.js    # 14 motores de simulação matemática em HTML5 Canvas, High-DPI e interatividade UI
└── README.md    # Documentação completa do projeto
```
