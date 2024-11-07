import "../styles/presentation.css";

export default function Presentation() {
    return (
        <div className="presentation-container">
            <h1 className="presentation-title">Bem-vindo ao Sistema de Gerenciamento de Estoque</h1>
            <p className="presentation-intro">
                Este aplicativo foi desenvolvido para facilitar o controle e a organização do seu estoque. 
                Com uma interface amigável e funcionalidades poderosas, você pode gerenciar fornecedores, 
                clientes, pedidos, produtos e transações de maneira eficiente e integrada.
            </p>
            <h2 className="presentation-subtitle">Funcionalidades Principais:</h2>
            <ul className="presentation-features">
                <li><strong>Gestão de Fornecedores:</strong> Adicione, edite ou remova fornecedores de maneira simples e rápida.</li>
                <li><strong>Gestão de Clientes:</strong> Controle sua base de clientes, incluindo dados de contato e histórico de transações.</li>
                <li><strong>Pedidos:</strong> Crie, acompanhe e atualize pedidos para garantir uma operação eficiente.</li>
                <li><strong>Produtos:</strong> Cadastre e organize seu catálogo de produtos, mantendo as quantidades sempre atualizadas.</li>
                <li><strong>Transações:</strong> Registre entradas e saídas de produtos, gerenciando seu fluxo de estoque com precisão.</li>
            </ul>
            <p className="presentation-footer">
                Com essas ferramentas, seu negócio estará preparado para lidar com demandas de estoque e manter um 
                controle rigoroso sobre todas as operações. Aproveite para explorar as funcionalidades e tornar sua 
                gestão mais eficiente!
            </p>
        </div>
    );
}
