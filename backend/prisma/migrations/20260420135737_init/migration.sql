-- CreateTable
CREATE TABLE `movimentacao` (
    `id_movimentacao` INTEGER NOT NULL AUTO_INCREMENT,
    `tipo` ENUM('ENTRADA', 'SAIDA') NOT NULL,
    `quantidade` INTEGER NOT NULL,
    `data` DATETIME(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),
    `id_usuario` INTEGER NOT NULL,
    `id_produto` INTEGER NOT NULL,

    INDEX `fk_mov_produto`(`id_produto`),
    INDEX `fk_mov_usuario`(`id_usuario`),
    PRIMARY KEY (`id_movimentacao`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `produto` (
    `id_produto` INTEGER NOT NULL AUTO_INCREMENT,
    `nome` VARCHAR(100) NOT NULL,
    `descricao` TEXT NULL,
    `categoria` VARCHAR(50) NULL,
    `unidade_medida` VARCHAR(20) NULL,
    `quantidade` INTEGER NOT NULL DEFAULT 0,
    `quantidade_minima` INTEGER NOT NULL,

    PRIMARY KEY (`id_produto`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `usuario` (
    `id_usuario` INTEGER NOT NULL AUTO_INCREMENT,
    `nome` VARCHAR(100) NOT NULL,
    `email` VARCHAR(100) NOT NULL,
    `senha` VARCHAR(255) NOT NULL,
    `perfil` ENUM('ADMIN', 'FUNCIONARIO') NOT NULL,

    UNIQUE INDEX `email`(`email`),
    PRIMARY KEY (`id_usuario`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `movimentacao` ADD CONSTRAINT `fk_mov_produto` FOREIGN KEY (`id_produto`) REFERENCES `produto`(`id_produto`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `movimentacao` ADD CONSTRAINT `fk_mov_usuario` FOREIGN KEY (`id_usuario`) REFERENCES `usuario`(`id_usuario`) ON DELETE RESTRICT ON UPDATE CASCADE;
